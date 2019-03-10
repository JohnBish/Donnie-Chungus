if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
const PI_2 = Math.PI / 2;
const MODEL_X_ROT = 0;
const MODEL_Y_ROT = -0.1;

var container, controls;
var camera, scene, model, renderer, params, uniforms;
var modelXRotOffset = 0;
var modelYRotOffset = 0;
init();
animate();
async function init() {
    container = document.getElementById( 'three' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( - 1, 5, 10 );
    controls = new THREE.OrbitControls( camera );
    controls.target.set( 0, 1.5, - 0.2 );
    controls.update();
    controls.dispose();
    scene = new THREE.Scene();
    var loader = new THREE.GLTFLoader().setPath( 'models/' );
    loader.load( 'chungus.glb', function ( gltf ) {
        model = gltf.scene;
        model.rotation.y = MODEL_Y_ROT;
        scene.add( model );
    } );
    await (() => {params = {
        speed: 1,
        segments: 128,
        octaves: 2.0,
        threshold: 5.0,
        mapping: 10.0,
        texture: "gradient"
    }})();
    await (() => {uniforms = {
        time: {value: 1.0},
        octaves: {value: params.octaves},
        threshold: {value: params.threshold},
        scale: {value: params.mapping},
        tGrad: null
    }})();
    loadSampler(params.texture)
    //const geometry = new THREE.PlaneGeometry( 10, 10, 128, 128 );
    const geometry = new THREE.SphereGeometry(15, 16, 16);
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: document.getElementById('simplexVertexShader').textContent,
        fragmentShader: document.getElementById('simplexFragmentShader').textContent
    });
    //const material = THREE.MeshBasicMaterial();
    var plane = new THREE.Mesh( geometry, material );
    plane.scale.x = 3;
    plane.scale.y = 2;
    plane.position.x = 13;
    plane.position.y = -1;
    plane.position.z = -17;
    scene.add( plane );
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', onMouseMove, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseMove(e) {
    if ( model ) {
        modelXRotOffset = (e.clientY - window.innerHeight / 2) * (PI_2 / window.innerHeight);
        modelYRotOffset = (e.clientX - window.innerWidth / 2) * (PI_2 / window.innerWidth);
        model.rotation.x = MODEL_X_ROT + modelXRotOffset;
        model.rotation.y = MODEL_Y_ROT + modelYRotOffset;
    }
}

function loadSampler(name) {
    uniforms.tGrad = {
        type: "t",
        value: new THREE.TextureLoader().load('img/' + name + '.jpg')
    }
}

function animate(timestamp) {
    requestAnimationFrame( animate );
    uniforms.time.value = timestamp / (100000 / params.speed)
    renderer.render( scene, camera );
}