// JavaScript document
/*
    Grundlagen der Gestaltung Framework
    Univerität Ulm
    Institut für Medienforschung und -entwicklung
    Tobias Lahmann
*/

/*
 * Die Permutationen werden automatisch erweitert. Es muss darauf geachtet werden, dass
 * die Permutationen Ein Zeilen- oder Spaltenvektor oder eine Matrix sind.
 *
 * ============================================================================================
 * Die Perutationen können mit beliebigen Zahlen gefüllt werden, diese werden allerding auf
 * die Anzahl der Elemente einer Folge hinuntergerechnet.
 * Beispiel:
 *          Perm = [[22,44,66],
 *                  [66,22,44],
 *                  [44,66,22]]
 *          Obj = { 1, 2, 3 }
 *
 * Dann ist die Resultierende Verteilung der Objekte auf dem Array:
 *                 [[1,2,3],
 *                  [3,1,2],
 *                  [2,3,1]]
 *
 * Hier werden die Elemente dann zyklisch durchgeschaltet (alle Stellen +1)
 *
 * ============================================================================================
 * Sollte die Permutation größer als die anzahl der Elemente sein wird dieses ebenfalls
 * umgerechnet um die Elemente zu verteilen.
 * Beispiel:
 *          Perm = [[22,44,66],
 *                  [66,22,44],
 *                  [44,66,22]]
 *          Obj = { 1, 2 }
 *
 * Dann ist die Resultierende Verteilung der Objekte auf dem Array:
 *                 [[1,2,1],
 *                  [1,1,2],
 *                  [2,1,1]]
 */

// Permutationen
var permutationen =
[[
    [1, 2, 3, 4, 4, 3, 2, 1],
    [3, 4, 5, 6, 8, 7, 6, 5],
    [1, 2, 3, 4, 4, 3, 2, 1],
    [5, 6, 7, 8, 6, 5, 4, 3],
    [1, 2, 3, 4, 4, 3, 2, 1],
    [3, 4, 5, 6, 8, 7, 6, 5],
    [1, 2, 3, 4, 4, 3, 2, 1],
    [5, 6, 7, 8, 6, 5, 4, 3]
], [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [2, 1, 2, 3, 4, 5, 6, 7],
    [3, 2, 1, 2, 3, 4, 5, 6],
    [4, 3, 2, 1, 2, 3, 4, 5],
    [5, 4, 3, 2, 1, 2, 3, 4],
    [6, 5, 4, 3, 2, 1, 2, 3],
    [7, 6, 5, 4, 3, 2, 1, 2],
    [8, 7, 6, 5, 4, 3, 2, 1]
], [
    [1,1,1,1,1,1,1,1],
	[1,2,2,2,2,2,2,1],
	[1,2,3,3,3,3,2,1],
	[1,2,3,4,4,3,2,1],
	[1,2,3,4,4,3,2,1],
	[1,2,3,3,3,3,2,1],
	[1,2,2,2,2,2,2,1],
	[1,1,1,1,1,1,1,1]
], [
    [1,2,3,4,5,6,7,8],
	[2,2,3,4,5,6,7,7],
	[3,3,3,4,5,6,6,6],
	[4,4,4,4,5,5,5,5],
	[6,6,6,4,5,3,3,3],
	[7,7,6,4,5,3,2,2],
	[8,7,6,4,5,3,2,1]
]];

/* ============================================================================================
 * Verwendete Objekte werden hier eingetragen, dabei ist darauf zu achten, dass das Bennenungs-
 * schema und die Struktur erhalten bleibt.
 * numberOfObjects: gibt an wie viele Elemente die Folge enthält. Es ist wichtig, dass
 *                  (mindestens!) die angegebene Anzahl an Bildern im ausgewiesenem Ordner ist.
 *
 * elements: listet die Ordner der objekte auf, die zu dieser Gruppe gehören.
 *
 * Datenstruktur zum Backup:
 *
 {
    "numberOfObjects": "n",
    "elements": [
        { "name": "folder1" },
        { "name": "folder2" }
    ]
}
 */
var objekte =
[{
    "numberOfObjects": "8",
    "elements": [
        { "name": "3-3" },
        { "name": "2-2" }
    ]
},
{
    "numberOfObjects": "8",
    "elements": [
        { "name": "4-1" },
		{ "name": "4-2" },
		{ "name": "4-3" }
    ]
},
{
	"numberOfObjects": "8",
	"elements": [
		{ "name": "5-1" },
		{ "name": "5-2" },
		{ "name": "5-3" }
	]
},
{
	"numberOfObjects": "8",
	"elements": [
		{ "name": "6-1" },
		{ "name": "6-2" },
		{ "name": "6-3" }
	]
}];

var currentPerm = 0; // Speichert die aktuelle Permutation
var currentObject = 0; // Speichert das akutelle Objekt

var running = Boolean(true); // spielt ab
var typeSwitch = 0; // Umschaltung zwischen typen
var animationrate = 100; // ms

var ANIMATIONPOSITIONX = 156; // x Koordinate des Animationsbereichs
var ANIMATIONPOSITIONY = 56; // y Koordinate des Animationsbereichs
var ANIMATIONSIZE = 408; // Größe (Höhe, Breite) des Animationsbereichs, immer quadratisch

var animat = []; // Array, welches die Bilder beihaltet

var context = document.getElementById('canvas').getContext('2d');

var obj, matriceHeight, matriceWidth, scale;

//funktion: entsprechende Animationsobjekte initialisieren
function initialize() {
    // Bei der Umschaltung von Objekten oder der umschaltung von permutationen wird die initialize()-Methode aufgerufen. In diesem Fall wird der running-Boolean ebenfalls umgeschaltet um die Funktion des Play/Pause-Buttons wieder zu berichtigen.
    if (!running) {
        running = !running;
    }

    var folder = $("inhalt[typ='animation']").attr("quelle");

    animat = [];
    // liest die Quelle aller aktuell betrachteten Bilder ein und speichert sie als img() in Array animat
    for (i = 0; i < objekte[currentObject].numberOfObjects; i++) {
        var img = new Image();
        img.src = folder
            + objekte[currentObject].elements[typeSwitch].name
            + "/" + (i + 1) + ".png";
        animat[i] = img;
    }

    // Skaliert die einzelnen currAnim um bei unterschiedlicher Frame-Anzahl immer die gleiche Größe des Animationsbereichs beizubehalten
    scale = ANIMATIONSIZE / objekte[currentObject].numberOfObjects;

    // berechne die aktuellen Array-Größen
    obj = objekte[currentObject].numberOfObjects;
    matriceHeight = permutationen[currentPerm].length;
    matriceWidth = permutationen[currentPerm][0].length;

    draw();
}

// timer hilfsvariablen
var fps = 12;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

//funktion: entsprechende Animationsobjekte initialisieren und auf die stage bringen
function draw() {
    if (running) {
        requestAnimationFrame(draw);

        now = Date.now();
        delta = now - then;

        if (delta > interval) {
            then = now - (delta % interval);

            // clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // erhöhe alle stellen um 1
            for (i = 0; i < matriceHeight; i++) {
                for (j = 0; j < matriceWidth; j++) {
                    permutationen[currentPerm][i][j] += 1;
                }
            }

            // zeichne an die berechneten Positionen die benötigten bilder
            for (i = 0; i < obj; i++) {
                for (j = 0; j < obj; j++) {
                    var d = null;
                    d = permutationen[currentPerm][j % matriceHeight][i % matriceWidth] % obj;
                    context.drawImage(animat[d],
                                            (i * scale) + ANIMATIONPOSITIONX,
                                            (j * scale) + ANIMATIONPOSITIONY,
                                            scale,
                                            scale);
                }
            }
        }
    }
}

// funktion: fallauswahl: wenn der Player nicht abspielt wird die Animation gestartet, ansonsten pausiert;
function playPauseAnimation() {
    if (!running) {
        playAnimation();
    } else {
        pauseAnimation();
    }
}

// funktion: pausieren/stoppen der currentAnimation
function pauseAnimation() {
    running = false;
    draw();
}

// funktion: (wieder-)abspielen der currentAnimation;
function playAnimation() {
    running = true;
    draw();
}

// funktion: geschwindigkeit erhoehen;
function changeSpeed() {
    if (fps < 35) {
        fps += 7;
    } else {
        fps = 7;
    }
    interval = 1000 / fps;
}

// funktion: geschwindigkeit erhoehen;
function faster() {
    if (fps < 30) {
        fps += 2;
        interval = 1000 / fps;
    }
}

// funktion: geschwindigkeit verringern
function slower() {
    if (fps >= 3) {
        fps -= 2;
        interval = 1000 / fps;
    }
}

// funktion: permutation weiter schalten
function changePermutation() {
    currentPerm += 1;
    currentPerm %= permutationen.length;
    initialize();
}

// funktion: permutationen weiter schalten
function changePermutationFwrd() {
    currentPerm += 1;
    currentPerm %= permutationen.length;
    initialize();
}

// funktion: permutationen zurück schalten
function changePermutationBack() {
    currentPerm -= 1;
    if (currentPerm < 0) {
        currentPerm = permutationen.length - 1;
    } else {
        currentPerm %= permutationen.length;
    }
    initialize();
}

// funktion: objekt weiter schalten
function changeObject() {
    currentObject += 1;
    currentObject %= objekte.length;
    initialize();
}

// funktion: objekt weiter schalten
function changeObjectFwrd() {
    currentObject += 1;
    currentObject %= objekte.length;
    typeSwitch = 0;
    initialize();
}

// funktion: objekt zurück schalten
function changeObjectBack() {
    currentObject -= 1;
    if (currentObject < 0) {
        currentObject = objekte.length - 1;
    } else {
        currentObject %= objekte.length;
    }
    typeSwitch = 0;
    initialize();
}

// funktion: objekttyp ändern
function changeTypeOfObj() {
    typeSwitch += 1;
    typeSwitch %= objekte[currentObject].elements.length;
    initialize();
}
