Template.game.helpers({

  decklist: function() {
    return Decks.find({}, {
      sort: {
        name: 1,
        id: 1
      }
    });
  }

});

Template.game.events({
  "click #game": function() {

    // Drag and drop?

  },

  "keydown #game": function(event) {

    console.log('down: ' + event.which);

    // space: tap
    if (event.which === 32) {
      MNM.tap();
    }

    // z: zoom in
    if (event.which === 90) {
      MNM.zoomIn();
    }
  },

  "keyup #game": function(event) {

    console.log('up: ' + event.which);

    // z: zoom out
    if (event.which === 90) {
      MNM.zoomOut();
    }
  }
});

Template.game.rendered = function() {
  MNM.init();
};


MNM = (function() {

  var INTERSECTED;
  var camera;
  var campos;
  var camrot;
  var zoomed = false;
  var cube;
  var scene;
  var renderer;
  var count;
  var mouse;
  var raycaster;


  function onDocumentMouseMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  }

  function animate(time) {

    requestAnimationFrame(animate);

    TWEEN.update(time);

    render();
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

  return {

    init: function () {
      THREE.ImageUtils.crossOrigin = '';

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x77C73E);

      var $div = $('#game');

      if ($div.children().length === 0) {
        $div.append(renderer.domElement);
      }

      // Set focus to get key events (also need tabindex="1" on the div)
      $div.focus();


      /*
      Card size 63mm x 88mm x 0.305mm (online)

      TODO: Measure acutal height of 100 cards stack?
      */
      var geometry = new THREE.BoxGeometry(62, 88, 0.4);

      count = 0;
      mouse = new THREE.Vector2();
      raycaster = new THREE.Raycaster();
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

/*
          if (count % 10 === 0) {
            cube.rotation.y = Math.PI;
          }
          cube.rotation.z = Random.fraction() - 0.5;

          cube.position.x = Random.fraction() * 800 - 400;
          cube.position.y = Random.fraction() * 400 - 200;
          cube.position.z = count * 0.4;
*/
          cube.position.x = count * 65 - 600;
          cube.position.z = count * 0.4;

          scene.add(cube);
        }
      });

      var light = new THREE.AmbientLight(0xffffff);
      scene.add(light);

      camera.position.z = 400;

      document.addEventListener('mousemove', onDocumentMouseMove, false);

      animate();
    },

    zoomIn: function() {
      if (INTERSECTED && !zoomed) {

        zoomed = true;
        campos = new THREE.Vector3().copy(camera.position);
        camrot = new THREE.Vector3().copy(camera.rotation);

        var position = INTERSECTED.object.position;
        var rotation = INTERSECTED.object.rotation;

        new TWEEN.Tween(camera.position).to({
            x: position.x,
            y: position.y,
            z: position.z + 100
          }, 400)
          .easing(TWEEN.Easing.Sinusoidal.InOut).start();

        new TWEEN.Tween(camera.rotation).to({
            x: rotation.x,
            y: rotation.y,
            z: rotation.z
          }, 400)
          .easing(TWEEN.Easing.Sinusoidal.InOut).start();
      }
    },

    zoomOut: function() {

      new TWEEN.Tween(camera.position).to(campos, 400)
        .easing(TWEEN.Easing.Sinusoidal.InOut).start();

      new TWEEN.Tween(camera.rotation).to(camrot, 400)
        .easing(TWEEN.Easing.Sinusoidal.InOut).start();

      zoomed = false; // BUT only when tween complete.

    },

    tap: function() {

      if (INTERSECTED.object.rotation.z === 0) {
        INTERSECTED.object.rotation.z = -Math.PI / 4;
      } else {
        INTERSECTED.object.rotation.z = 0;
      }
    }
  };
})();