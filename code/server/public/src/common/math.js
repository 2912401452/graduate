/**
 * 用于将屏幕上鼠标的二维坐标转换成三位世界的坐标
 * @param {*} x2D 
 * @param {*} y2D 
 * @param {*} domElement 
 */
function tranformMouseCoord(x2D, y2D, domElement){
    var mouse = new THREE.Vector2();
    mouse.x = ( x2D / domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( y2D / domElement.clientHeight ) * 2 + 1;
    return mouse;
}