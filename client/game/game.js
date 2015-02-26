Template.game.helpers({

  decklist: function () {
    return Decks.find({}, {sort: {name: 1, id: 1}});
  }

});

Template.game.events({
  "click #game": function () {

    // Drag and drop?
     
  },

  "keydown #game": function (event) {

    // space: tap
    if (event.which === 32) {
      if (INTERSECTED.object.rotation.z === 0) {
        INTERSECTED.object.rotation.z = -Math.PI/4;
      } else {
        INTERSECTED.object.rotation.z = 0;
      }      
    }

    // z: zoom in
    if (event.which === 90) {

      if (INTERSECTED && !zoomed) {
console.log(event.which);

        zoomed = true;
        campos = new THREE.Vector2().copy(camera.position);
        camrot = new THREE.Vector2().copy(camera.rotation);

        var position = INTERSECTED.object.position;
        var rotation = INTERSECTED.object.rotation;

        new TWEEN.Tween( camera.position ).to( {
            x: position.x,
            y: position.y,
            z: position.z + 100}, 600 )
          .easing( TWEEN.Easing.Sinusoidal.InOut).start();

        new TWEEN.Tween( camera.rotation ).to( {
            x: rotation.x,
            y: rotation.y,
            z: rotation.z }, 600 )
          .easing( TWEEN.Easing.Sinusoidal.InOut).start();
      }
    }
  },

  "keyup #game": function (event) {
 
 console.log('up: '+event.which);

    // z: zoom out
    if (event.which === 90) {
      new TWEEN.Tween( camera.position ).to( campos, 600 )
        .easing( TWEEN.Easing.Sinusoidal.InOut).start();

      new TWEEN.Tween( camera.rotation ).to( camrot, 600 )
        .easing( TWEEN.Easing.Sinusoidal.InOut).start();

      zoomed = false; // BUT only when tween complete.

    }
  }


});

var INTERSECTED;
var camera;
var campos;
var camrot;
var zoomed = false;
  
Template.game.rendered = function () {

  $('#game').focus();

  /*
  Card size 63mm x 88mm x 0.305mm (online)

  TODO: Measure acutal height of 100 cards stack.
  */

  THREE.ImageUtils.crossOrigin = '';

  var cube;
  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x77C73E);

  var $div = $('#game');

  if ($div.children().length === 0) {
      $div.append(renderer.domElement);
  }

  var geometry = new THREE.BoxGeometry(62, 88, 0.4);

  var count = 0;
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var black = new THREE.MeshLambertMaterial({
      color: 0x000000
  });


  var query = Decks.find();
  var handle = query.observeChanges({
      added: function(id, card) {

          count++;

          console.log("Adding: " + card.name);

          // material

          var materials = [
              black,
              black,
              black,
              black,
              new THREE.MeshLambertMaterial({
                  map: THREE.ImageUtils.loadTexture('http://api.mtgdb.info/content/card_images/' + card.id + '.jpeg')
              }),
              new THREE.MeshLambertMaterial({
                  map: THREE.ImageUtils.loadTexture('/img/back.jpeg')
              })
          ];

          cube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));


          if (count % 10 === 0) {
              cube.rotation.y = Math.PI;
          }
          cube.rotation.z = Random.fraction() - 0.5;

          cube.position.x = Random.fraction() * 500 - 250;
          cube.position.y = Random.fraction() * 200 - 100;
          cube.position.z = count * 0.4;

          scene.add(cube);
      }
  });

  var light = new THREE.AmbientLight(0xffffff);
  scene.add(light);

  camera.position.z = 200;

  document.addEventListener('mousemove', onDocumentMouseMove, false);

  function animate(time) {

      requestAnimationFrame(animate);

      TWEEN.update( time );

      render();
  }

  animate();

  function onDocumentMouseMove(event) {

      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  }

  function render() {

      /*        theta += 0.1;

              camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
              camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
              camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
              camera.lookAt( scene.position );

              camera.updateMatrixWorld();
      */
      // find intersections

      raycaster.setFromCamera(mouse, camera);

      var intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {

          if (INTERSECTED != intersects[0]) {

              if (INTERSECTED) INTERSECTED.object.material.materials[INTERSECTED.face.materialIndex].emissive.setHex(INTERSECTED.currentHex);

              INTERSECTED = intersects[0];
              INTERSECTED.currentHex = INTERSECTED.object.material.materials[INTERSECTED.face.materialIndex].emissive.getHex();
              INTERSECTED.object.material.materials[INTERSECTED.face.materialIndex].emissive.setHex(0x555555);

          }

      } else {

          if (INTERSECTED) INTERSECTED.object.material.materials[INTERSECTED.face.materialIndex].emissive.setHex(INTERSECTED.currentHex);

          INTERSECTED = null;

      }

      renderer.render(scene, camera);
  }
}