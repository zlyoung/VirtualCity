var THREEx = THREEx || {};
THREEx.ProceduralCity	= function(){
    // 为每个建筑物建立基本几何形状
    var geometry = new THREE.CubeGeometry( 1, 1, 1 );
    // 将参考点设置在立方体的底部
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
    // 去掉立方体的底面
    // geometry.faces.splice( 3, 1 );
    // geometry.faceVertexUvs[0].splice( 3, 1 );
    // 修复顶面的UV映射
    // 屋顶将和地板颜色相同，且建筑物的各面纹理共用
    // geometry.faceVertexUvs[0][3][3].set( 0, 0);
    // geometry.faceVertexUvs[0][3][3].set( 0, 0 );
    // // geometry.faceVertexUvs[0][2][2].set( 0, 0 );
    // // geometry.faceVertexUvs[0][2][3].set( 0, 0 );
    // 建筑物网孔
    var buildingMesh= new THREE.Mesh( geometry );

    /**
     * 返回buildingMesh的引用
     * @returns {THREE.Mesh}
     */
    this.createBuilding	= function(){
        return buildingMesh;
    };

    /**
     * lamp
     */
    var lampGeometry = new THREE.CubeGeometry( 0.1, 3, 0.1);
    var lampMesh = new THREE.Mesh(lampGeometry);

    /**
     * 参数设置
     */
    var nBlockX	= 10;//行数
    var nBlockZ	= 10;//列数
    var blockSizeX = 50;//行宽
    var blockSizeZ = 50;//列宽
    var blockDensity = 2;
    var roadW = 8;
    var roadD = 8;
    var buildingMaxW = 15;
    var buildingMaxD = 15;
    var sidewalkW = 2;
    var sidewalkH = 0.1;
    var sidewalkD = 2;
    var lampDensityW = 4;
    var lampDensityD = 4;
    var lampH = 3;//路灯高度

    /**
     * 创建广告牌
     * @returns {THREE.Object3D}
     */
    this.createBillBoard	= function(){
        var object3d = new THREE.Object3D();
        var lampGeometry = new THREE.CubeGeometry(1, 1, 1);
        lampGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        var video = document.querySelector("#video");
        var texture = new THREE.VideoTexture(video);
        var material1 = new THREE.MeshBasicMaterial( { map: texture } );
        var material2 = new THREE.MeshBasicMaterial( { color: 0x111111 } );
        var materials = [material1, material1, material2, material2, material1, material1];
        var lampMesh = new THREE.Mesh(lampGeometry, materials);
        lampMesh.scale.set(16, 9, 16);
        lampMesh.position.y = 12;
        object3d.add(lampMesh);

        var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 32);
        cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        var cylinderMesh = new THREE.Mesh(cylinderGeometry);
        cylinderMesh.scale.set(1, 12, 1);
        for(var i = 0; i < cylinderMesh.geometry.faces.length; i++ ) {
            cylinderMesh.geometry.faces[i].color.set('grey' );
        }
        var material3 = new THREE.MeshLambertMaterial({
            vertexColors	: THREE.VertexColors
        });
        cylinderMesh.material = material3;
        object3d.add(cylinderMesh);
        return object3d
    };

    /**
     * 创建地板
     * @returns {THREE.Mesh}
     */
    this.createSquareGround	= function(){
        var geometry = new THREE.PlaneGeometry(1, 1, 1);
        var texture = THREE.ImageUtils.loadTexture("./images/road.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 40, 40 );

        var material = new THREE.MeshLambertMaterial({
            map :texture,
        });
        var ground	= new THREE.Mesh(geometry, material);
        ground.lookAt(new THREE.Vector3(0,1,0));
        //设置地板大小
        ground.scale.x	= (nBlockZ)*blockSizeZ;
        ground.scale.y	= (nBlockX)*blockSizeX;
        return ground;
    };

    /**
     * 创建圆柱形建筑
     * @returns {THREE.Object3D}
     */
    this.createb	= function(){
        var geometry = new THREE.CylinderGeometry( 10, 10, 70, 5 );
        var texture = THREE.ImageUtils.loadTexture("./images/house2/1.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        var material	= new THREE.MeshLambertMaterial({
            map		: texture,
        });

        var texture1 = THREE.ImageUtils.loadTexture("./images/house2/2.jpg");
        texture1.wrapS = THREE.RepeatWrapping;
        texture1.wrapT = THREE.RepeatWrapping;
        texture1.repeat.set( 3, 3 );
        var material1	= new THREE.MeshLambertMaterial({
            map		: texture1,
        });
        var materials = [material, material1, material1];
        var cylinder = new THREE.Mesh( geometry, materials );
        cylinder.position.x = 100;
        return cylinder;
    };

    /**
     * 创建路灯
     * @returns {THREE.Object3D}
     */
    this.createSquareLamps	= function(){
        var object3d = new THREE.Object3D();

        var lampGeometry = new THREE.CubeGeometry(1, 1, 1);
        lampGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        var lampMesh = new THREE.Mesh(lampGeometry);

        var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1);
        cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
        var cylinderMesh = new THREE.Mesh(cylinderGeometry);

        var lightsGeometry	= new THREE.Geometry();
        var lampsGeometry	= new THREE.Geometry();

        for(var blockZ = 0; blockZ < nBlockZ; blockZ++){
            for( var blockX = 0; blockX < nBlockX; blockX++){
                function addLamp(position){
                    //灯光
                    var lightPosition	= position.clone();
                    lightPosition.y		= sidewalkH+lampH+0.1;
                    // set position for block
                    lightPosition.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    lightPosition.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    lightsGeometry.vertices.push(lightPosition );

                    //灯泡
                    lampMesh.position.copy(position);
                    lampMesh.position.y = sidewalkH + lampH - 0.1;
                    // 缩放
                    lampMesh.scale.set(0.2, 0.3, 0.2);
                    // 着色
                    for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
                        lampMesh.geometry.faces[i].color.set('white');
                    }
                    // 设置位置
                    lampMesh.position.x += (blockX+0.5-nBlockX/2)*blockSizeX;
                    lampMesh.position.z += (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    THREE.GeometryUtils.merge(lampsGeometry, lampMesh );

                    //杆
                    cylinderMesh.position.copy(position);
                    cylinderMesh.position.y += sidewalkH;
                    // add poll offset
                    cylinderMesh.scale.set(0.06, lampH, 0.06);
                    // 着色
                    for(var i = 0; i < cylinderMesh.geometry.faces.length; i++ ) {
                        cylinderMesh.geometry.faces[i].color.set('grey' );
                    }
                    // 设置位置
                    cylinderMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    cylinderMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    THREE.GeometryUtils.merge( lampsGeometry, cylinderMesh );

                    //底座
                    cylinderMesh.position.copy(position);
                    cylinderMesh.position.y += sidewalkH;
                    cylinderMesh.scale.set(0.1,0.4,0.1);
                    // 着色
                    for(var i = 0; i < cylinderMesh.geometry.faces.length; i++ ) {
                        cylinderMesh.geometry.faces[i].color.set('maroon' );
                    }
                    // 设置位置
                    cylinderMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    cylinderMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    // merge it with cityGeometry - very important for performance
                    THREE.GeometryUtils.merge( lampsGeometry, cylinderMesh);
                }
                // south
                var position	= new THREE.Vector3();
                for(var i = 0; i < lampDensityW+1; i++){
                    position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW);
                    position.z	= -0.5*(blockSizeZ-roadD-sidewalkD);
                    addLamp(position)
                }
                // north
                for(var i = 0; i < lampDensityW+1; i++){
                    position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW);
                    position.z	= +0.5*(blockSizeZ-roadD-sidewalkD);
                    addLamp(position)
                }
                // east
                for(var i = 1; i < lampDensityD; i++){
                    position.x	= +0.5*(blockSizeX-roadW-sidewalkW);
                    position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD);
                    addLamp(position)
                }
                // west
                for(var i = 1; i < lampDensityD; i++){
                    position.x	= -0.5*(blockSizeX-roadW-sidewalkW);
                    position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD);
                    addLamp(position)
                }
            }
        }

        // build the lamps Mesh
        var material = new THREE.MeshLambertMaterial({
            vertexColors	: THREE.VertexColors
        });
        var lampsMesh	= new THREE.Mesh(lampsGeometry, material );
        object3d.add(lampsMesh);

        //灯光贴图
        var texture	= THREE.ImageUtils.loadTexture( "./images/lensflare2_alpha.png" );
        var material	= new THREE.ParticleBasicMaterial({
            map		: texture,
            size		: 8,
            transparent	: true
        });
        var lightParticles	= new THREE.ParticleSystem( lightsGeometry, material );
        lightParticles.sortParticles = true;
        object3d.add( lightParticles );
        return object3d
    };

    /**
     * 创建车灯
     * @returns {THREE.Object3D}
     */
    this.createSquareCarLights	= function(){
        var carLightsDensityD = 4;
        var carW = 1;
        var carH = 2;

        var geometry = new THREE.Geometry();
        var position = new THREE.Vector3();
        position.y	= carH/2;

        var colorFront = new THREE.Color('white');
        var colorBack = new THREE.Color('red');

        for( var blockX = 0; blockX < nBlockX; blockX++){
            for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
                function addCarLights(position){
                    var positionL	= position.clone();
                    positionL.x	+= -carW/2;
                    // set position for block
                    positionL.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    positionL.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    geometry.vertices.push( positionL );
                    geometry.colors.push( colorFront );

                    var positionR	= position.clone();
                    positionR.x	+= +carW/2;
                    // set position for block
                    positionR.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    positionR.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    geometry.vertices.push( positionR );
                    geometry.colors.push( colorFront );

                    position.x	= -position.x;

                    var positionL	= position.clone();
                    positionL.x	+= -carW/2;
                    // set position for block
                    positionL.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    positionL.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    geometry.vertices.push( positionL );
                    geometry.colors.push( colorBack );

                    var positionR	= position.clone();
                    positionR.x	+= +carW/2;
                    // set position for block
                    positionR.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    positionR.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    geometry.vertices.push( positionR );
                    geometry.colors.push( colorBack )
                }
                // east
                for(var i = 0; i < carLightsDensityD+1; i++){
                    position.x	= +0.5*blockSizeX-roadW/4;
                    position.z	= (i/carLightsDensityD-0.5)*(blockSizeZ-roadD);
                    addCarLights(position)
                }
            }
        }
        var object3d	= new THREE.Object3D;

        var texture	= THREE.ImageUtils.loadTexture( "./images/lensflare2_alpha.png" );
        var material = new THREE.ParticleBasicMaterial({
            map	: texture,
            size : 6,
            transparent : true,
            vertexColors : THREE.VertexColors
        });
        var particles	= new THREE.ParticleSystem( geometry, material );
        particles.sortParticles = true;
        object3d.add(particles);

        return object3d
    };

    /**
     * 创建道路
     * @returns {THREE.Mesh}
     */
    this.createSquareSideWalks	= function(){
        var buildingMesh= this.createBuilding();
        var sidewalksGeometry= new THREE.Geometry();
        for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
            for( var blockX = 0; blockX < nBlockX; blockX++){
                // set position
                buildingMesh.position.x	= (blockX+0.5-nBlockX/2)*blockSizeX;
                buildingMesh.position.z	= (blockZ+0.5-nBlockZ/2)*blockSizeZ;

                buildingMesh.scale.x	= blockSizeX-roadW;
                buildingMesh.scale.y	= sidewalkH;
                buildingMesh.scale.z	= blockSizeZ-roadD;

                // merge it with cityGeometry - very important for performance
                THREE.GeometryUtils.merge( sidewalksGeometry, buildingMesh );
            }
        }
        // build the mesh
        var texture = THREE.ImageUtils.loadTexture("./images/floor.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 12, 12 );
        var material	= new THREE.MeshLambertMaterial({
            map		: texture,
        });
        return new THREE.Mesh(sidewalksGeometry, material )
    };

    /**
     * 创建建筑1
     * @returns {THREE.Mesh}
     */
    this.createSquareBuildings1	= function(){
        var buildingMesh= this.createBuilding();
        var cityGeometry= new THREE.Geometry();
        for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
            for( var blockX = 0; blockX < nBlockX; blockX++){
                for( var i = 0; i < blockDensity; i++){
                    // set position
                    buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW);
                    buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD);
                    // add position for the blocks
                    buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    // put a random scale
                    buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
                    buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 3 + 6;
                    buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD);
                    // merge it with cityGeometry - very important for performance
                    THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
                }
            }
        }

        // build the city Mesh
        var material	= new THREE.MeshLambertMaterial({
            map		: THREE.ImageUtils.loadTexture("./images/house1/1.jpg"),
        });
        var texture = THREE.ImageUtils.loadTexture("./images/house1/2.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        var material1	= new THREE.MeshLambertMaterial({map : texture,});
        var materials = [material, material, material1, material, material, material];
        return new THREE.Mesh(cityGeometry, materials );
    };

    /**
     * 创建建筑2
     * @returns {THREE.Mesh}
     */
    this.createSquareBuildings2	= function(){
        var buildingMesh= this.createBuilding();
        var cityGeometry= new THREE.Geometry();
        for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
            for( var blockX = 0; blockX < nBlockX; blockX++){
                for( var i = 0; i < blockDensity; i++){
                    // set position
                    buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW);
                    buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD);
                    // add position for the blocks
                    buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX;
                    buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ;
                    // put a random scale
                    buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
                    buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 3 + 6;
                    buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD);
                    // merge it with cityGeometry - very important for performance
                    THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
                }
            }
        }

        // build the city Mesh
        var material	= new THREE.MeshLambertMaterial({
            map		: THREE.ImageUtils.loadTexture("./images/house3/1.jpg"),
        });
        var texture = THREE.ImageUtils.loadTexture("./images/house3/2.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
        var material1	= new THREE.MeshLambertMaterial({map : texture,});
        var materials = [material, material, material1, material, material, material];
        return new THREE.Mesh(cityGeometry, materials );
    };

    /**
     * 创建虚拟城市
     * @returns {THREE.Object3D}
     */
    this.createSquareCity	= function(){
        var object3d = new THREE.Object3D();

        var carLightsMesh = this.createSquareCarLights();
        object3d.add(carLightsMesh);

        var lampsMesh = this.createSquareLamps();
        object3d.add(lampsMesh);

        var sidewalksMesh = this.createSquareSideWalks();
        object3d.add(sidewalksMesh);

        var buildingsMesh1 = this.createSquareBuildings1();
        object3d.add(buildingsMesh1);

        var buildingsMesh2 = this.createSquareBuildings2();
        object3d.add(buildingsMesh2);

        var groundMesh	= this.createSquareGround();
        object3d.add(groundMesh);

        var billBoard = this.createBillBoard();
        object3d.add(billBoard);

        var groundMeshb	= this.createb();
        object3d.add(groundMeshb);

        return object3d
    };
};

function initSkyBox() {
    scene.background = new THREE.CubeTextureLoader()
        .setPath('./images/skybox/shinei-_').load(
            ["BK.jpg", "FR.jpg", "UP.jpg", "DN.jpg", "LF.jpg", "RT.jpg"]);
}

//渲染器
var renderer;
var width;
var height;
var stats;
function initThree() {
    width = document.getElementById('canvas-frame').clientWidth;
    height = document.getElementById('canvas-frame').clientHeight;
    renderer = new THREE.WebGLRenderer({
        antialias : true
    });
    renderer.setSize(width, height);
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    renderer.setClearColor(0xFFFFFF, 1.0);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('canvas-frame').appendChild(stats.domElement);
}

//相机
var camera;
function initCamera() {
    camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.x = -500;
    camera.position.y = 150;
    camera.position.z = 200;
}

//场景
var scene;
function initScene() {
    scene = new THREE.Scene();
    scene.fog	= new THREE.FogExp2(0xd0e0f0, 0.0005);
}
//光线
var light;
function initLight() {
    light	= new THREE.HemisphereLight( 0xffffff, 0x101020, 1.25 );
    light.position.set( 0.75, 1, 0.25 );
    scene.add( light );
}

function initObject() {
    var proceduralCity	= new THREEx.ProceduralCity();
    var mesh = proceduralCity.createSquareCity();
    scene.add(mesh);
    initSkyBox();
}

var updateFcts	= [];
function initControl(){
    var controls	= new THREE.FirstPersonControls(camera);
    controls.movementSpeed	= 100;
    controls.lookSpeed	= 0.05;
    controls.lookVertical	= true;
    updateFcts.push(function(delta){
        controls.update( delta );
    });

    //	render the scene
    updateFcts.push(function(){
        renderer.render( scene, camera );
    })
}

var lastTimeMsec= null;
function render()
{
    requestAnimationFrame(function animate(nowMsec){
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec	= lastTimeMsec || nowMsec-1000/60;
        var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec	= nowMsec;
        // call each update function
        updateFcts.forEach(function(updateFn){
            updateFn(deltaMsec/1000, nowMsec/1000)
        });
        stats.update();
    });
}

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    initControl();
    render();
}