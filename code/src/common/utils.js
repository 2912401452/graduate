/**
 * 确定相应位置上选中了那些对象
 * @param {*} coords 
 * @param {*} camera 
 * @param {*} Meshes 
 */
function getSelectedMeshes( coords, camera, Meshes ){
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera( coords, camera );	
    var intersects = raycaster.intersectObjects( Meshes );
    return intersects;
}
/**
 * 返回传入对象的父对象 (需要由额外属性isParent的支持)
 * @param {*} selectedMesh 
 */
function getParent(selectedMesh){
    if(selectedMesh.userData.isParent !== true){
        return getParent(selectedMesh.parent);
    }
    return selectedMesh;
}
