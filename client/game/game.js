Template.game.helpers({});

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

        // r: reset - all cards to the deck
        if (event.which === 82) {
            MNM.reset();
        }

        // f: flip - flip card over
        if (event.which === 70) {
            MNM.flip();
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

    var INTERSECTED, SELECTED;
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
    var offset;
    var objects = [];
    var container;
    var plane;


    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        //
        raycaster.setFromCamera(mouse, camera);

        if (SELECTED) {
            var intersects = raycaster.intersectObject(plane);
            SELECTED.position.copy(intersects[0].point.sub(offset));
            return;
        }

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {

            if (INTERSECTED != intersects[0].object) {

                if (INTERSECTED) {
                    INTERSECTED.material.materials[4].emissive.setHex(0x000000);
                    INTERSECTED.material.materials[5].emissive.setHex(0x000000);
                }

                INTERSECTED = intersects[0].object;
                //        INTERSECTED.currentHex = INTERSECTED.material.materials[4].color.getHex();
                INTERSECTED.material.materials[4].emissive.setHex(0x444444);
                INTERSECTED.material.materials[5].emissive.setHex(0x444444);

                plane.position.copy(INTERSECTED.position);
                //        plane.lookAt(camera.position);
            }

            //      container.style.cursor = 'pointer';

        } else {

            if (INTERSECTED) {
                INTERSECTED.material.materials[4].emissive.setHex(0x000000);
                INTERSECTED.material.materials[5].emissive.setHex(0x000000);
            }
            INTERSECTED = null;
            //      container.style.cursor = 'auto';
        }
    }

    function onDocumentMouseDown(event) {
        event.preventDefault();
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(objects);
        if (intersects.length > 0) {
            //      controls.enabled = false;
            SELECTED = intersects[0].object;
            var intersects = raycaster.intersectObject(plane);
            offset.copy(intersects[0].point).sub(plane.position);
            //      container.style.cursor = 'move';
        }
    }

    function onDocumentMouseUp(event) {
        event.preventDefault();
        //    controls.enabled = true;
        if (INTERSECTED) {
            plane.position.copy(INTERSECTED.position);
            SELECTED = null;
        }
        //    container.style.cursor = 'auto';
    }

    function animate(time) {

        requestAnimationFrame(animate);

        TWEEN.update(time);

        renderer.render(scene, camera);

        //    render();
    }

    return {

        init: function() {
            THREE.ImageUtils.crossOrigin = '';

            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);

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
            offset = new THREE.Vector3();
            raycaster = new THREE.Raycaster();
            var black = new THREE.MeshLambertMaterial({
                color: 0x000000
            });

            var query = LeagueCards.find({
                inDeck: true
            });

            var backTexture = THREE.ImageUtils.loadTexture('/img/back.jpeg');
            backTexture.minFilter = THREE.LinearFilter;

            var handle = query.observeChanges({

                added: function(id, card) {

                    count++;

                    console.log("Adding: " + card.name);

                    // material
                    // Hi-res
                    //              THREE.ImageUtils.loadTexture('http://api.mtgdb.info/content/hi_res_card_images/' + card.id + '.jpg')

                    var tex = THREE.ImageUtils.loadTexture('http://api.mtgdb.info/content/card_images/' + card.id + '.jpeg');
                    tex.minFilter = THREE.LinearFilter;

                    var materials = [
                        black,
                        black,
                        black,
                        black,
                        new THREE.MeshLambertMaterial({
                            map: tex
                        }),
                        new THREE.MeshLambertMaterial({
                            map: backTexture
                        })
                    ];

                    cube = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

                    cube.rotation.z = Random.fraction() - 0.5;

                    cube.position.x = Random.fraction() * 800 - 400;
                    cube.position.y = Random.fraction() * 400 - 200;
                    cube.position.z = count * 0.4;

                    /*
                              cube.position.x = count * 65 - 600;
                              cube.position.z = count * 0.4;
                            */
                    scene.add(cube);

                    objects.push(cube);
                }
            });

            plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    opacity: 0.25,
                    transparent: true
                })
            );
            plane.visible = false;
            scene.add(plane);

            var light = new THREE.AmbientLight(0xffffff);
            scene.add(light);

            camera.position.z = 400;

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            document.addEventListener('mousedown', onDocumentMouseDown, false);
            document.addEventListener('mouseup', onDocumentMouseUp, false);

            // Save initial camera pos/rot for "zoom out"
            campos = new THREE.Vector3().copy(camera.position);
            camrot = new THREE.Vector3().copy(camera.rotation);

            animate();
        },

        zoomIn: function() {
            if (INTERSECTED && !zoomed) {

                zoomed = true;
                //        campos = new THREE.Vector3().copy(camera.position);
                //        camrot = new THREE.Vector3().copy(camera.rotation);

                var position = INTERSECTED.position;
                var rotation = INTERSECTED.rotation;

                new TWEEN.Tween(camera.position).to({
                        x: position.x,
                        y: position.y,
                        z: position.z + 100
                    }, 400)
                    .easing(TWEEN.Easing.Sinusoidal.InOut).start();

                new TWEEN.Tween(camera.rotation).to({
                        x: rotation.x,
                        //  y: rotation.y,
                        z: rotation.z
                    }, 400)
                    .easing(TWEEN.Easing.Sinusoidal.InOut).start();
            }
        },

        zoomOut: function() {

            new TWEEN.Tween(camera.position).to(campos, 400)
                .easing(TWEEN.Easing.Sinusoidal.InOut).start();

            new TWEEN.Tween(camera.rotation).to(camrot, 400)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .onComplete(function() {
                    // This still gets confused sometimes.
                    zoomed = false;
                }).start();

        },

        tap: function() {

            var orientation = INTERSECTED.rotation.z ? 0 : -Math.PI / 4;

            new TWEEN.Tween(INTERSECTED.rotation).to({
                    z: orientation
                }, 400)
                .easing(TWEEN.Easing.Sinusoidal.InOut).start();

        },

        reset: function() {

            var height = 0;

            // for every card,
            _.each(_.shuffle(objects), function(card) {

                height++;

                new TWEEN.Tween(card.position).to({
                        x: 0,
                        y: 0,
                        z: height * 0.4
                    }, 1000)
                    .easing(TWEEN.Easing.Sinusoidal.InOut).start();

                new TWEEN.Tween(card.rotation).to({
                        x: 0,
                        y: Math.PI,
                        z: 0
                    }, 1000)
                    .easing(TWEEN.Easing.Sinusoidal.InOut).start();

            });

        },

        flip: function() {

            var orientation = INTERSECTED.rotation.y ? 0 : Math.PI;

            new TWEEN.Tween(INTERSECTED.rotation).to({
                    y: orientation
                }, 400)
                .easing(TWEEN.Easing.Sinusoidal.InOut).start();

        }
    };
})();