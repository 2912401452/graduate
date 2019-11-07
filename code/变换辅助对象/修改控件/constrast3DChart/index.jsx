import React, { Component } from 'react';
import * as THREE from 'three';
import 'three/examples/js/controls/OrbitControls.js';
import 'three/examples/js/lines/LineSegmentsGeometry.js';
import 'three/examples/js/lines/LineGeometry.js';
import 'three/examples/js/lines/LineMaterial.js';
import 'three/examples/js/lines/LineSegments2.js';
import 'three/examples/js/lines/Line2.js';
import { tween, easing } from 'popmotion';
import { reduceConfig } from '../../utils/reduce-config';
import { config } from './js/config';
import mockData from './mocks/data';
import { isEqual } from 'lodash';

export class Constrast3DChart extends Component {
  constructor(props) {
    super(props);
    let { configuration } = this.props;
    this.config = reduceConfig(configuration);
    let chart = this.config.chart;
    this.axisBaseLength = chart.axisY.axisLength;
    this.axisLenK = 1;
    this.axisLengthK = 1;
    this.axisMarkK = 1;
    this.k = 1;
    this.scaleY = 1.3;
    this.scaleX = chart.component.scaleX / 50;
    let axisItems = [];
    this.datamax = mockData.data.length > 0 ? mockData.data[0].h : 0;
    this.datamin = mockData.data.length > 0 ? mockData.data[0].h : 0;
    for (let j = 0; j < mockData.data.length; j++) {
      this.datamax = this.datamax < mockData.data[j].h ? mockData.data[j].h : this.datamax;
      this.datamin = this.datamin > mockData.data[j].h ? mockData.data[j].h : this.datamin;
    }
    let count = chart.axisY.axisMark.count || 10;
    let max = chart.axisY.axisMark.max || 100;
    let min = chart.axisY.axisMark.min || 0;

    let amplify = 1;
    if (max < this.datamax) {
      amplify = this.datamax / max;
      max = this.datamax;
    }
    min = this.datamax > min ? min : this.datamin;

    // let textSplit = Math.floor((max - min) / count);
    let textSplit = Math.ceil((max - min) / count);
    let splitLen = chart.axisY.axisLength / count || 10;
    for (let i = 0; i < count; i++) {
      axisItems.push({
        height: min + splitLen * (i + 1),
        text: min + textSplit * (i + 1),
      });
    }
    this.axisItems = axisItems;
    let panels = [];
    let seriesStyles = {};
    Object.keys(chart.dtseries).map((entry, index) => {
      var obj = chart.dtseries[entry];
      seriesStyles[obj.name] = obj;
    });
    // let panelType = this.config.chart.dtseries;
    let _that = this;
    for (let m = 0; m < this.props.data.length; m++) {
      let item = this.props.data[m];
      try {
        panels.push({
          name: item.name,
          text: item.h,
          height: item.h / amplify,
          color: seriesStyles[item.name].color,
          // color: chart.dtseries[chart.dtseries[item.name].value].color
        });
      } catch (err) {}
    }
    this.panels = panels;
    this.animate = this.animate.bind(this);
    this.infoBoxList = [];
  }

  static defaultProps = {
    data: mockData.data,
  };

  componentDidMount() {
    this.initRender();
  }
  componentWillReceiveProps(nextProps) {
    const preConfig = this.config;
    let { configuration } = nextProps;
    this.config = reduceConfig(configuration);

    if (!isEqual(preConfig, this.config) || !isEqual(nextProps.data, this.props.data)) {
      if (this.turnTimer !== null) {
        clearTimeout(this.turnTimer);
      }
      if (this.mytween !== null) {
        this.mytween.stop();
      }
      this.isTurn = true;
      // console.log(this.config.chart);
      let chart = this.config.chart;
      let pchart = preConfig.chart;
      this.datamax = nextProps.data.length > 0 ? nextProps.data[0].h : 0;
      this.datamin = nextProps.data.length > 0 ? nextProps.data[0].h : 0;
      for (let j = 0; j < nextProps.data.length; j++) {
        this.datamax = this.datamax < nextProps.data[j].h ? nextProps.data[j].h : this.datamax;
        this.datamin = this.datamin > nextProps.data[j].h ? nextProps.data[j].h : this.datamin;
      }

      if (chart.axisY.axisLength !== pchart.axisY.axisLength) {
        if (chart.axisY.axisLength < this.datamax) {
          this.k = this.k / (this.datamax / chart.axisY.axisLength);
        }
        this.axisLengthK = chart.axisY.axisLength / this.axisBaseLength;
        this.k = chart.axisY.axisLength / this.axisBaseLength;
        this.axisLenK = this.k;
        this.k = this.k / ((pchart.axisY.axisMark.max - pchart.axisY.axisMark.min) / this.axisBaseLength);
      }

      if (
        chart.axisY.axisMark.max !== pchart.axisY.axisMark.max ||
        chart.axisY.axisMark.min !== pchart.axisY.axisMark.min
      ) {
        this.k = chart.axisY.axisLength / this.axisBaseLength;
        this.k = this.k / ((chart.axisY.axisMark.max - chart.axisY.axisMark.min) / this.axisBaseLength);
        this.axisMarkK = this.k;
      }

      this.scaleX = chart.component.scaleX / 50; //(chart.axisY.axisLength/pchart.axisY.axisLength);
      let cameraPosition = {
          x: chart.cameraPosition.x,
          y: chart.cameraPosition.y,
          z: chart.cameraPosition.z,
        },
        width = chart.dimension.chartDimension.width,
        height = chart.dimension.chartDimension.height;
      this.configCamera(width, height, 45, [cameraPosition.x, cameraPosition.y, cameraPosition.z]);
      this.mapRender.setSize(width, height);

      this.removeAll();

      let axisItems = [];
      let count = chart.axisY.axisMark.count || 10;
      let max = chart.axisY.axisMark.max || 100;
      let min = chart.axisY.axisMark.min || 0;

      let amplify = 1;
      if (max < this.datamax) {
        amplify = this.datamax / max;
        max = this.datamax;
      }
      min = this.datamax > min ? min : this.datamin;

      let textSplit = (max - min) / count;
      let splitLen = chart.axisY.axisLength / count || 10;
      for (let i = 0; i < count; i++) {
        axisItems.push({
          height: min + splitLen * (i + 1),
          text: min + textSplit * (i + 1),
        });
      }
      this.axisItems = axisItems;
      let _that = this;
      let seriesStyles = {};
      Object.keys(chart.dtseries).map((entry, index) => {
        var obj = chart.dtseries[entry];
        seriesStyles[obj.name] = obj;
      });
      let panels = [];
      for (let m = 0; m < nextProps.data.length; m++) {
        let item = nextProps.data[m];
        try {
          panels.push({
            name: item.name,
            text: item.h,
            height: (item.h / amplify) * _that.k,
            color: seriesStyles[item.name].color,
            // color: chart.dtseries[chart.dtseries[item.name].value].color  //item.s
          });
        } catch (err) {}
      }
      this.panels = panels;

      this.infoBoxList = [];
      this.group = new THREE.Group();
      this.otherGroup = new THREE.Group();

      this.initScene();
      this.isTurn = false;
      this.startTurn();
    }
  }
  initRender() {
    this.isTurn = false; // 当前组件是否在旋转
    this.turnTimer = null;
    this.mytween = null;
    let cameraPosition = {
        x: this.config.chart.cameraPosition.x,
        y: this.config.chart.cameraPosition.y,
        z: this.config.chart.cameraPosition.z,
      },
      width = this.config.chart.dimension.chartDimension.width,
      height = this.config.chart.dimension.chartDimension.height;
    this.mapRender = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.mapRender.setSize(width, height);
    this.mapRender.setClearColor(0xeeeeee, 0.0);
    this.mapContainer.appendChild(this.mapRender.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    // this.control = new THREE.OrbitControls(this.camera, this.mapRender.domElement)
    this.configCamera(width, height, 45, [cameraPosition.x, cameraPosition.y, cameraPosition.z]);
    this.group = new THREE.Group();
    this.otherGroup = new THREE.Group();
    this.initScene();
    // this.addEmitEvent();
    this.animate();
    this.startTurn();
  }
  initScene() {
    this.initAxis();
    this.initPanels();
    this.initInfoBoxs();
    this.scene.add(this.otherGroup);
  }
  initAxis() {
    let color = this.config.chart.axisY.axisColor;
    let mycolor = new THREE.Color().setStyle(color.toLocaleLowerCase());
    let _that = this;

    let lineMat = new THREE.LineMaterial({
      color: mycolor,
      transparent: true,
      opacity: 0.6,
      linewidth: _that.config.chart.axisY.axisWidth,
      dashed: false,
    });
    // 把渲染窗口尺寸分辨率传值给材质LineMaterial的resolution属性
    lineMat.resolution.set(window.innerWidth, window.innerHeight);

    let lineGeo = new THREE.LineGeometry();
    lineGeo.setPositions([0, 0, 0, 0, _that.config.chart.axisY.axisLength, 0]);
    lineGeo.scale(1, this.scaleY, 1);
    let line = new THREE.Line2(lineGeo, lineMat);
    this.group.add(line);

    let options = this.initAxisTexts();
    // this.initAxisTitle( this.config.chart.axisY.axisTitle, color,this.config.chart.axisY.axisLength*this.scaleY + 10, options );
    this.initAxisMarks(lineMat);
  }
  initAxisTitle(title, color, height, options) {
    let font = this.config.chart.component.fontFamily;
    let planWidth = (2 * this.config.chart.axisY.axisLength) / 5;
    let planeGeo = new THREE.PlaneGeometry(planWidth, planWidth / 2);
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let fs = this.config.chart.axisY.fontSize * 0.5;
    ctx.font = fs + 'px ' + font;
    ctx.fillStyle = color;
    ctx.fillText('单位:' + title, 0, fs * 1.5);
    let material = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      opacity: 0.6,
      depthTest: false,
    });
    planeGeo.translate(-options.planWidth, 0, 0);
    let plane = new THREE.Mesh(planeGeo, material);
    plane.position.y = this.config.chart.component.baseY + height;
    this.otherGroup.add(plane);
  }
  initAxisTexts() {
    // let planWidth = this.config.chart.axisY.axisLength / 5;
    let planWidth = this.config.chart.axisY.axisLength / this.config.chart.axisY.axisMark.count;
    let planeGeo = new THREE.PlaneGeometry(planWidth * 2, planWidth);
    let options = {
      planWidth,
      planeGeo,
      color: this.config.chart.axisY.axisTextColor,
    };
    this.axisItems.forEach((item) => {
      this.initAxisText(
        Math.ceil(item.text),
        this.config.chart.axisY.fontSize * this.config.chart.axisY.axisMark.count,
        item.height * this.scaleY,
        options
      );
    });
    return options;
  }
  initAxisText(text, size, height, options) {
    let font = this.config.chart.component.fontFamily;
    let spaceToAxis = this.config.chart.axisY.spaceToAxis;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    ctx.font = size + 'px ' + font;
    ctx.fillStyle = options.color;
    ctx.fillText(text, 160 - spaceToAxis - size / 2, size);
    let material = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(canvas),
      transparent: true,
      opacity: 0.6,
      depthTest: false,
    });
    options.planeGeo.translate(-options.planWidth / 5, 0, 0);
    let plane = new THREE.Mesh(options.planeGeo, material);
    plane.position.y = this.config.chart.component.baseY + height;
    this.otherGroup.add(plane);
  }
  initAxisMarks(lineMat) {
    let _that = this;
    let markLineGeo = new THREE.LineGeometry();
    markLineGeo.setPositions([0, 0, 0, -_that.config.chart.axisY.axisLength / 20, 0, 0]);
    this.axisItems.forEach((item) => {
      this.initAxisMark(markLineGeo, lineMat, item.height);
    });
  }
  initAxisMark(markLineGeo, lineMat, height) {
    let markLine = new THREE.Line2(markLineGeo, lineMat);
    markLine.position.y = height * this.scaleY + this.config.chart.component.baseY;
    this.otherGroup.add(markLine);
  }
  initPanels() {
    let len = this.panels.length;
    let baseRotateY = (Math.PI * 2) / len;
    for (let i = 0; i < len; i++) {
      this.initPanel(this.panels[i].height, this.panels[i].color, baseRotateY * i, i);
    }
    let g = this.group;
    g.position.y = this.config.chart.component.baseY;
    this.scene.add(g);
  }
  initPanel(height, color, rotaleY) {
    let k = this.scaleX;
    let axisMarkK = this.axisMarkK;
    let _that = this;
    let lineWidth = this.config.chart.component.panelLineWidth;
    let mycolor = new THREE.Color().setStyle(color.toLocaleLowerCase());
    // 平
    // let panelGeo = new THREE.CircleGeometry((height * k) / _that.axisLengthK, 64);//-
    let panelGeo = new THREE.CircleGeometry((height * k) / (_that.axisLengthK * axisMarkK), 64);
    let panelMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(mycolor),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      depthTest: false,
    });
    let circle = new THREE.Mesh(panelGeo, panelMat);
    circle.rotation.x = -Math.PI / 2;
    this.group.add(circle);

    let lineMat = new THREE.LineMaterial({
      color: mycolor,
      linewidth: lineWidth,
      dashed: false,
    });
    lineMat.resolution.set(window.innerWidth, window.innerHeight);

    let pos1 = panelGeo.vertices.concat([]);
    pos1.push(panelGeo.vertices[1]);
    pos1.splice(0, 1);
    let pos1Arr = [];
    pos1.forEach((item) => {
      pos1Arr.push(item.x);
      pos1Arr.push(item.y);
      pos1Arr.push(item.z);
    });
    let lineGeo = new THREE.LineGeometry();
    lineGeo.setPositions(pos1Arr);
    let circleLine = new THREE.Line2(lineGeo, lineMat);
    circleLine.rotation.x = -Math.PI / 2;

    this.group.add(circleLine);
    // 竖
    // let panelGeo2 = new THREE.CircleGeometry((height * k) / _that.axisLengthK, 64, 0, Math.PI / 2);//-
    let panelGeo2 = new THREE.CircleGeometry((height * k) / (_that.axisLengthK * axisMarkK), 64, 0, Math.PI / 2);
    // panelGeo2.scale(1, (this.scaleY * _that.axisLengthK) / k, 1);//-
    panelGeo2.scale(1, (this.scaleY * _that.axisLengthK * axisMarkK) / k, 1);
    let circle2 = new THREE.Mesh(panelGeo2, panelMat);
    circle2.rotation.y = -rotaleY;
    this.group.add(circle2);

    let pos2 = panelGeo2.vertices.concat([]);
    let pos2Arr = [];
    pos2.forEach((item) => {
      pos2Arr.push(item.x);
      pos2Arr.push(item.y);
      pos2Arr.push(item.z);
    });
    let lineGeo2 = new THREE.LineGeometry();
    lineGeo2.setPositions(pos2Arr);
    let circleLine2 = new THREE.Line2(lineGeo2, lineMat);
    circleLine2.rotation.y = -rotaleY;

    this.group.add(circleLine2);
  }
  initInfoBoxs() {
    this.panels.forEach((item) => {
      this.initInfoBox(item.height, item.text, item.color);
    });
  }
  initInfoBox(height, text, color) {
    let k = this.axisLenK;
    let lineWidth = this.config.chart.component.panelLineWidth;
    let font = this.config.chart.infoBox.fontFamily;
    let fontSize = this.config.chart.infoBox.fontSize;
    let horizaltalLineLength = this.config.chart.infoBox.horizaltalLineLength;
    let mycolor = new THREE.Color().setStyle(color.toLocaleLowerCase());

    let addX = this.config.chart.infoBox.infoBoxAddWidth;
    let addY = this.config.chart.infoBox.infoBoxAddHeight;
    let infoTextColor = this.config.chart.infoBox.infoTextColor;
    const moveLen = this.config.chart.axisY.axisLength / 5;
    let moveY = this.config.chart.component.baseY;
    height *= this.scaleY;
    let canvas = document.createElement('canvas');
    canvas.width += (150 * addX) / moveLen;
    canvas.height += (150 * addY) / moveLen;
    let ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = (lineWidth * 5) / 2;
    ctx.strokeRect(0, 0, 300 + (150 * addX) / moveLen, 150 + (150 * addY) / moveLen);
    ctx.fillStyle = infoTextColor;
    ctx.font = fontSize * 2 + 'px ' + font;
    // ctx.fillText( text, moveLen*10/k + 75*addX/moveLen + offSetX, moveLen*11/k + 75*addY/moveLen + offSetY );
    // ctx.fillText( text, moveLen*10/k + 75*addX/moveLen + offSetX - fontSize/moveLen - fontSize/moveLen, moveLen*11/k + 75*addY/moveLen + offSetY + fontSize/moveLen + fontSize/moveLen );
    ctx.fillText(text, 150 + (75 * addX) / moveLen - fontSize, 75 + (75 * addY) / moveLen + (fontSize * 4) / 5);
    let infoMat = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(canvas),
      visible: false,
      depthTest: false,
    });
    let infoGeo = new THREE.PlaneGeometry(moveLen * 2 + addX, moveLen + addY); // 文字
    infoGeo.translate(horizaltalLineLength + moveLen * 4 + addX / 2, height + moveY + moveLen + addY / 2, 0);
    let infoBox = new THREE.Mesh(infoGeo, infoMat);

    let infoBgGeo = new THREE.PlaneGeometry(moveLen * 2 + addX, moveLen + addY); // 背景
    infoBgGeo.translate(horizaltalLineLength + moveLen * 4 + addX / 2, height + moveY + moveLen + addY / 2, 0);
    let infoBg = new THREE.Mesh(
      infoBgGeo,
      new THREE.MeshBasicMaterial({
        color: mycolor,
        transparent: true,
        opacity: 0.3,
        visible: false,
        depthTest: false,
      })
    );

    let lineMat = new THREE.LineMaterial({
      color: mycolor,
      linewidth: lineWidth,
      dashed: false,
      visible: false,
      depthTest: false,
    });
    lineMat.resolution.set(window.innerWidth, window.innerHeight);
    let lineGeo = new THREE.LineGeometry();
    lineGeo.setPositions([
      0,
      height + moveY,
      0,
      moveLen * 2 + horizaltalLineLength,
      height + moveY,
      0,
      moveLen * 3 + horizaltalLineLength,
      height + moveY + moveLen / 2,
      0,
    ]);
    let line = new THREE.Line2(lineGeo, lineMat);
    this.otherGroup.add(infoBg);
    this.otherGroup.add(infoBox);
    this.otherGroup.add(line);
    this.infoBoxList.push({ infoBox, infoBg, line });
  }
  changeInfoBox(index, lastIndex) {
    // if (!this.isTurn) {
    this.infoBoxList[index].infoBox.material.visible = true;
    this.infoBoxList[index].infoBg.material.visible = true;
    this.infoBoxList[index].line.material.visible = true;

    this.infoBoxList[lastIndex].infoBox.material.visible = false;
    this.infoBoxList[lastIndex].infoBg.material.visible = false;
    this.infoBoxList[lastIndex].line.material.visible = false;
    // }
  }
  configCamera(width, height, fov, position) {
    this.camera.aspect = width / height;
    this.camera.fov = fov;
    this.camera.near = 0.0001;
    this.camera.far = 1e5;
    this.camera.position.x = position[0];
    this.camera.position.y = position[1];
    this.camera.position.z = position[2];
    this.camera.updateProjectionMatrix();
  }
  startTurn() {
    if (this.infoBoxList.length === 0) return;
    this.infoBoxList.forEach((item) => {
      item.infoBox.material.visible = false;
      item.infoBg.material.visible = false;
      item.line.material.visible = false;
    });
    this.infoBoxList[0].infoBox.material.visible = true;
    this.infoBoxList[0].infoBg.material.visible = true;
    this.infoBoxList[0].line.material.visible = true;
    if (this.infoBoxList.length === 1) return;
    let markRotateY = (Math.PI * 2) / this.panels.length;
    let baseRotateY = 0;
    let group = this.group;
    let index = 0;
    let infoList = this.panels;
    let _that = this;
    //  ------
    turn();
    function turn() {
      _that.mytween = tween({
        from: {
          rotateY: baseRotateY,
        },
        to: {
          rotateY: baseRotateY + markRotateY,
        },
        ease: easing.easeInOut,
        duration: _that.config.chart.component.animTime * 1000,
      }).start({
        update: (o) => {
          group.rotation.y = o.rotateY;
        },
        complete: () => {
          baseRotateY += markRotateY;
          var lastIndex = index;
          index = index + 1 >= infoList.length ? 0 : index + 1;
          _that.changeInfoBox(index, lastIndex);
          _that.turnTimer = setTimeout(function() {
            // console.log(_that.isTurn)
            if (!_that.isTurn) {
              turn();
            } else {
              return;
            }
          }, _that.config.chart.component.animStopTime * 1000);
        },
      });
    }
    //  ------

    // this.turnTimer = setInterval(function() {
    //   if (_that.isTurn) {
    //     // 组件旋转
    //     _that.mytween = tween({
    //       from: {
    //         rotateY: baseRotateY,
    //       },
    //       to: {
    //         rotateY: baseRotateY + markRotateY,
    //       },
    //       ease: easing.easeInOut,
    //       duration: _that.config.chart.component.animTime*1000 - 200,
    //     }).start({
    //       update: (o) => {
    //         group.rotation.y = o.rotateY;
    //       },
    //       complete: () => {
    //         baseRotateY += markRotateY;
    //         var lastIndex = index;
    //         index = index + 1 >= infoList.length ? 0 : index + 1;
    //         _that.changeInfoBox(index, lastIndex);
    //       },
    //     });
    //   }
    //   _that.isTurn = !_that.isTurn;
    // }, _that.config.chart.component.animTime*1000);
  }
  mapRenderAction() {
    this.mapRender.render(this.scene, this.camera);
  }
  animate() {
    this.timer = requestAnimationFrame(this.animate);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.mapRenderAction();
  }
  addEmitEvent() {
    let wrap = this.mapRender.domElement;
    let group = this.group;
    // PC动作
    wrap.onmousedown = function(e) {
      let remX = e.clientX;
      wrap.onmousemove = function(e) {
        if (e.clientX > remX) {
          // 向右拖动
          group.rotation.y += 0.05;
        } else {
          // 向左拖动
          group.rotation.y -= 0.05;
        }
        remX = e.clientX;
      };
      wrap.onmouseup = function(e) {
        wrap.onmousemove = null;
      };
      wrap.onmouseout = function(e) {
        wrap.onmousemove = null;
      };
    };
    // 大屏动作
  }
  removeAll() {
    this.scene.remove(this.group);
    this.scene.remove(this.otherGroup);
    if (this.turnTimer !== null) {
      clearTimeout(this.turnTimer);
    }
    if (this.mytween !== null) {
      this.mytween.stop();
    }
  }
  componentWillUnmount() {
    this.removeAll();
    this.timer && cancelAnimationFrame(this.timer);
  }

  render() {
    /**
     * 组件从外部通过props获得原始的配置数据，经过reduceConfig处理删除用于展现表单的字段生成config对象
     * 但是每个组件如何使用自己的配置数据是不定的无法统一抽象到admin中
     * 所以这块逻辑需要放在每个组件中，比如下面将配置对象映射到styles变量。
     */
    const { configuration, id } = this.props;
    const { chart } = reduceConfig(configuration);
    const { dimension, iconConfig, dtseries } = chart;
    let textStyle = iconConfig.textStyle
    let seriesStyles = {},
      seriesIcons = [];
    Object.keys(dtseries).map((entry, index) => {
      var obj = chart.dtseries[entry];
      seriesStyles[obj.name] = obj;
      seriesIcons.push(obj);
    });
    let k = (textStyle.fontSize * 2 + 25 + iconConfig.layout.marginRight) * this.props.data.length;
    let y = dimension.chartDimension.width;
    let styles = {
      position: 'absolute',
      ...dimension.chartPosition,
      ...dimension.chartDimension,
      fontSize: textStyle.fontSize + 'px',
      fontFamily: textStyle.fontFamily,
      color: textStyle.color,
    };
    let displayType = iconConfig.show ? 'inline-block' : 'none';
    let left = 0,
      top = '10%',
      right = 'auto',
      float = 'none';
    if (iconConfig.layout.position === 'left') {
      left = '5%';
    } else if (iconConfig.layout.position === 'right') {
      left = '85%';
    } else {
      (top = '90%'), (float = 'left');
      if (iconConfig.layout.align === 'left') {
        left = '5%';
      } else if (iconConfig.layout.align === 'right') {
        left = 'auto';
        right = '5%';
      } else {
        left = (1 - k / y) * 50 + '%';
      }
    }

    let styleswrap = {
      display: displayType,
      width: textStyle.iconSize + 'px',
      height: textStyle.iconSize + 'px',
      marginRight: iconConfig.layout.marginRight,
    };
    let ulStyle = {
      position: 'absolute',
      top,
      left,
      right,
    };
    /**
     * 每个组件**必须**包含
     * 1. 统一的 __easyv-component 类名
     * 2. id={ this.props.id } 当被添加到具体大屏中的时候生成的uuid
     */
    return (
      <div className='__easyv-component' style={styles} id={id}>
        <div
          ref={(el) => (this.mapContainer = el)}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <ul style={ulStyle}>
            {// dtseries[item.name]
            seriesIcons.map((item) => {
              return (
                <li key={item.name} style={{ float: float }}>
                  <div
                    key={item.name}
                    style={{
                      ...styleswrap,
                      backgroundColor: item.color,
                      opacity: 0.6,
                    }}
                  >
                    {/* <div style={{
                          height: '100%',
                          backgroundColor: item.color,
                          opacity: 0.6 
                        }}>
                        </div> */}
                  </div>
                  <span
                    style={{
                      display: displayType,
                      marginRight: '10px',
                    }}
                  >
                    {item.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
  /**
   * @description
   * admin 后台通过此方法获得组件的原始数据，再通过props回传到组件
   * 每个组件**必须**包含此方法
   * @static
   * @returns
   *
   * @memberOf Constrast3DChart
   */
  static getDefaultConfig() {
    return config;
  }
  static getDefaultData() {
    return mockData;
  }
}
