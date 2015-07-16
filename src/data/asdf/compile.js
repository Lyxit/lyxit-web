var jade = require('jade'),
    fs = require('fs');

fs.readFile('index.jade', 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
    var fn = jade.compile(data);
    var html = fn({
      projects: {
        quadrate: { //Must match .class in css
          name: "Quadrate",
          description: "Avoid the falling blocks."
        },
        houdy: {
          name: "Houdy",
          description: "A game where you jump and shoot fireballs.",
          soon: true
        },
        ttt: {
          name: "TurnTurnTurn",
          description: "A game where you turn and avoid stuff.",
          soon: true
        },
        bgg: {
          name: "BoardGameGroups",
          description: "Manage your groups and play to reach the top!",
          soon: true
        },
        apk: {
          name: "AlkoPK",
          description: "Find which alcohol gives you the most bang for the buck."
        },
        charades: {
          name: "Charader från kodrader",
          description: "Simply the best charade app yet."
        }
      }
    });
    console.log(html);
});
