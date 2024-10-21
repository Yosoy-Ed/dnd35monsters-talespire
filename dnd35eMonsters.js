/////////////////////////////////////////////////// SRD MONSTERS ////////////////////////////////////////////////
var monsterDetailsArray = [];
var featsObj = {};
//var featsArrayTxt = [];
//var featsArrayName = [];
var srdMonsterData = {};
var selectedListMonsterTemplate = `<br>
                    <p>
                    <h2 class="select-data-monsterlist" id="selectedMonsterName"></h2>
                    </p><br>
                    <table class="table">
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Challenge Rating</td>
                            <td class="select-data-monsterlist" id="selectedChallengeRating"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Alignment</td>
                            <td class="select-data-monsterlist" id="selectedAlignment"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Size</td>
                            <td class="select-data-monsterlist" id="selectedSize"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Type</td>
                            <td class="select-data-monsterlist" id="selectedType"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Hit Dice</td>
                            <td class="select-data-monsterlist" id="selectedHitDice"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Initiative</td>
                            <td class="select-data-monsterlist" id="selectedInitiative"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Speed</td>
                            <td class="select-data-monsterlist" id="selectedSpeed"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Armor Class</td>
                            <td class="select-data-monsterlist" id="selectedArmorClass"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Base Attack</td>
                            <td class="select-data-monsterlist" id="selectedBaseAttack"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Grapple</td>
                            <td class="select-data-monsterlist" id="selectedGrapple"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Attack</td>
                            <td class="select-data-monsterlist" id="selectedAttack"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Full Attack</td>
                            <td class="select-data-monsterlist" id="selectedFullAttack"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Space/Reach</td>
                            <td class="select-data-monsterlist" id="selectedSpaceReach"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Special Attacks</td>
                            <td class="select-data-monsterlist" id="selectedSpecialAttacks"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Special Qualities</td>
                            <td class="select-data-monsterlist" id="selectedSpecialQualities"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Saves</td>
                            <td class="select-data-monsterlist" id="selectedSaves"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Abilities</td>
                            <td class="select-data-monsterlist" id="selectedAbilities"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Skills</td>
                            <td class="select-data-monsterlist" id="selectedSkills"></td>
                        </tr>
                        <tr>
                            <td class="custom-data-name  col-4 fw-bold col-1">Feats</td>
                            <td class="select-data-monsterlist" id="selectedFeats"></td> 
                        </tr>                      
                    </table> 
                    
                    <div id="monster-details-div"></div>
                    <br>
                    <div class="card rounded-6">
                      <div class="card card-body">     
                        <h1>Monster Details</h1>
                          <p class="select-data-monsterlist" id="selectedDetails"></p><br>
                      </div>
                    </div>`

function loadingFromMemory() {

  // Load Monster List
  TS.localStorage.campaign.getBlob().then((storedData) => {
    data = JSON.parse(storedData || "{}");

    //Initialize Inventory object
    if (typeof data.monsterList === 'undefined') {

      data.monsterList = {
        "srd": {},
        "custom": {}
      }

      TS.localStorage.campaign.setBlob(JSON.stringify(data));
      console.log('monsterList object created');
    } else {
      console.log('monsterList object already exists, list loaded');

    }

    for (let key in data.monsterList["custom"]) {
      //populateListMonster(MonsterObject, fromSrd, srdFromMemory, customFromMemory) 
      populateListMonster(data.monsterList["custom"][key], false, false, true);
    }
    for (let key in data.monsterList["srd"]) {
      //populateListMonster(MonsterObject, fromSrd, srdFromMemory, customFromMemory) 
      populateListMonster(data.monsterList["srd"][key], true, true, false);
    }

  });
}

// Function to load XML data and process it
function loadMonsterData() {
  return new Promise((resolve, reject) => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", "monster.xml", true);
    xmlHttpRequest.onload = function () {
      if (xmlHttpRequest.status === 200) {
        const xmlParser = new DOMParser();
        const xmlDocument = xmlParser.parseFromString(xmlHttpRequest.responseText, "text/xml");
        const monsters = xmlDocument.getElementsByTagName("monster");

        const monsterData = {};
        for (let i = 0; i < monsters.length; i++) {
          const monster = monsters[i];
          monsterDetailsArray[i] = monster.getElementsByTagName("full_text")[0].innerHTML;
          const monsterName = monster.getElementsByTagName("name")[0]?.textContent;

          monsterData[monsterName] = {
            index: i,
            family: monster.getElementsByTagName("family")[0]?.textContent,
            name: monster.getElementsByTagName("name")[0]?.textContent,
            size: monster.getElementsByTagName("size")[0]?.textContent,
            type: monster.getElementsByTagName("type")[0]?.textContent,
            descriptor: monster.getElementsByTagName("descriptor")[0]?.textContent,
            hit_dice: monster.getElementsByTagName("hit_dice")[0]?.textContent,
            initiative: monster.getElementsByTagName("initiative")[0]?.textContent,
            speed: monster.getElementsByTagName("speed")[0]?.textContent,
            armor_class: monster.getElementsByTagName("armor_class")[0]?.textContent,
            base_attack: monster.getElementsByTagName("base_attack")[0]?.textContent,
            grapple: monster.getElementsByTagName("grapple")[0]?.textContent,
            attack: monster.getElementsByTagName("attack")[0]?.textContent,
            full_attack: monster.getElementsByTagName("full_attack")[0]?.textContent,
            space: monster.getElementsByTagName("space")[0]?.textContent,
            reach: monster.getElementsByTagName("reach")[0]?.textContent,
            special_attacks: monster.getElementsByTagName("special_attacks")[0]?.textContent,
            special_qualities: monster.getElementsByTagName("special_qualities")[0]?.textContent,
            skills: monster.getElementsByTagName("skills")[0]?.textContent,
            feats: monster.getElementsByTagName("feats")[0]?.textContent,
            epic_feats: monster.getElementsByTagName("epic_feats")[0]?.textContent,
            saves: monster.getElementsByTagName("saves")[0]?.textContent,
            abilities: monster.getElementsByTagName("abilities")[0]?.textContent,
            environment: monster.getElementsByTagName("environment")[0]?.textContent,
            organization: monster.getElementsByTagName("organization")[0]?.textContent,
            challenge_rating: monster.getElementsByTagName("challenge_rating")[0]?.textContent,
            treasure: monster.getElementsByTagName("treasure")[0]?.textContent,
            alignment: monster.getElementsByTagName("alignment")[0]?.textContent,
            advancement: monster.getElementsByTagName("advancement")[0].textContent,
            special_abilities: monster.getElementsByTagName("special_abilities")[0]?.textContent,
            stat_block: monster.getElementsByTagName("stat_block")[0]?.textContent,
            full_text: monster.getElementsByTagName("full_text")[0]?.textContent,
            // ... other properties as needed
          };
        }

        resolve(monsterData); // Resolve the promise with the data
      } else {
        reject(new Error("Error loading XML data: " + xmlHttpRequest.status));
      }
    };
    xmlHttpRequest.send();
  });
}

function loadFeatsData() {
  return new Promise((resolve, reject) => {
    const xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.open("GET", "feat.xml", true);
    xmlHttpRequest.onload = function () {
      if (xmlHttpRequest.status === 200) {
        const xmlParser = new DOMParser();
        const xmlDocument = xmlParser.parseFromString(xmlHttpRequest.responseText, "text/xml");
        const feats = xmlDocument.getElementsByTagName("feat");

        for (let i = 0; i < feats.length; i++) {
          const feat = feats[i];
          //featsArrayName[i] = feat.getElementsByTagName("name")[0].textContent;
          //featsArrayTxt[i] = feat.getElementsByTagName("full_text")[0].innerHTML;
          featsObj[`${feat.getElementsByTagName("name")[0].innerHTML}`] = feat.getElementsByTagName("full_text")[0].innerHTML;
        }

        resolve('Feat Data loaded'); // Resolve the promise with the data
      } else {
        reject(new Error("Error loading XML data: " + xmlHttpRequest.status));
      }
    };
    xmlHttpRequest.send();
  });
}
//////////////////////////////////////////////////// INIT //////////////////////////////////////////////////////
window.onload = function () {

  loadFeatsData();

  loadMonsterData().then(monsterData => {
    try {

      srdMonsterData = monsterData;

      //populate the dropdown with the data from file -----------------------
      const dropdown = document.getElementById('monsterDropdown');
      const sortedKeys = Object.keys(monsterData).sort();

      //const srdMonsterDatalist = document.createElement('datalist');
      //srdMonsterDatalist.id = "srd-monster-datalist";

      for (const key of sortedKeys) {
        const option = document.createElement('option');
        option.value = key;
        option.text = key;
        dropdown.appendChild(option);
        //srdMonsterDatalist.appendChild(option.cloneNode(true));
      }

      //document.body.appendChild(srdMonsterDatalist);

      // Add event listener to the dropdown
      dropdown.addEventListener('change', function () {
        const selectedKey = dropdown.value;

        if (selectedKey != "") {
          viewsrdmonster(selectedKey);
        }
      });

    } catch (error) {
      console.error('Error fetching monster data:', error);
    }
    console.log("populated SRD data");
    loadingFromMemory(); //------------------------------------------------------////////////////////////////-
    console.log("loaded data from memory");
  }).catch(error => {
    console.error("Error loading monster data:", error);
  });
}
/*
// searchSrdMonster with datalist
function searchsrdmonster() {
  viewsrdmonster(document.getElementById('input-datalist').value);
}
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////// SRD TAB showing monsters ////////////////////////////////////////////////

function viewsrdmonster(monsterToShow) {

  const valueElement = document.getElementById('selectedSrdMonster');

  valueElement.innerHTML = monsterDetailsArray[srdMonsterData[monsterToShow]['index']];

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-success m-2';
  button.textContent = 'Add to your monsters';

  button.addEventListener('click', () => {

    //populateListMonster(data.monsterList["custom"][key], false, false, true);
    populateListMonster(srdMonsterData[monsterToShow], true, false, false);

  });

  document.getElementById('selectedSrdMonster').insertBefore(button, document.getElementById('selectedSrdMonster').firstChild);

}

//////////////////////////////////////////////////// ROLL //////////////////////////////////////////////////////

//rollValue('Hit Points','4d8+11')
async function rollValue(name, dice) {
  dice = dice.replace(` `, ``);

  console.log(`${name} -> ${dice}`);

  const regexd2 = /d2\b/g;
  const regexd3 = /d3\b/g;

  if (regexd2.test(dice) || regexd3.test(dice)) {

    d2d3Check(name, dice);

  } else {

    TS.dice.putDiceInTray([{ name: name, roll: dice }], false);

  }

}

///////////////////////////////////////////// ADD NEW MONSTER ////////////////////////////////////////////////

function AddNewMonster() {

  const form = document.getElementById('customMonsterForm');

  event.preventDefault(); // Prevent default form submission behavior

  // Create an empty object to store form data
  const formData = {};

  // Iterate over form elements and populate the object
  const elements = form.elements;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    // Check if the element is a submit button or a reset button
    if (element.type === 'submit' || element.type === 'reset') {
      continue; // Skip submit and reset buttons
    }
    formData[element.id] = element.value;
  }

  populateListMonster(formData, false, false, false);

};

//////////////////////////////////////////////// UTILITY ///////////////////////////////////////////////////

// Split an string with a word
function splitByWord(str, word) {
  const regex = new RegExp(`${word}`, 'g');
  return str.split(regex);
}

function parseSkills(skillString) {
  const skillSegments = skillString.split(', ');

  const skillObject = {};
  skillSegments.forEach(segment => {
    negativeSign = segment.includes('-') ? '-' : '+';
    const [skillName, modifier] = segment.split(/ \+|-/); // Split by either space + or space -
    const cleanedSkillName = skillName.trim(); // Remove any leading/trailing spaces
    const parsedModifier = `${negativeSign}${parseInt(modifier)}`;
    skillObject[cleanedSkillName] = isNaN(parsedModifier) ? null : parsedModifier;
  });

  return skillObject;
}

function parseDiceString(text, monsterName) {
  const regex = /\d+d\d+(\+\d+)|(\d+d\d+)(\-\d+)?/g;
  return text.replace(regex, (match) => {
    return `<a href="javascript:void(0);" onclick="rollValue('${monsterName} Roll', '${match}')">${match}</a>`;
  });
}

function parseModString(text, monsterName) {
  const regex = / \+\d+ | \-\d+ /g;
  return text.replace(regex, (match) => {
    return `<a href="javascript:void(0);" onclick="rollValue('${monsterName} Roll', '1d20${match}')">${match}</a>`;
  });
}

function parseSaveString(text, monsterName) {
  const regex = / \+\d+| \-\d+| \+\d+ | \-\d+ /g;
  return text.replace(regex, (match) => {
    return `<a href="javascript:void(0);" onclick="rollValue('${monsterName} Roll', '1d20${match}')">${match}</a>`;
  });
}

function parseAbilities(text, monsterName) {
  const regex = /\d+|\+\d+| \-\d+| \+\d+ | \-\d+ /g;
  return text.replace(regex, (match) => {
    const modValue = Math.floor((parseInt(match) - 10) / 2);
    const modSign = parseInt(modValue) >= 0 ? '+' : '-';
    return `<a href="javascript:void(0);" onclick="rollValue('${monsterName} Roll', '1d20${modSign}${Math.abs(modValue)}')">${match}</a>`;
  });
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////// CREATE MONSTER BUTTON ///////////////////////////////////////////////////

//fromSrd = true (srd)  
function populateListMonster(MonsterObject, fromSrd, srdFromMemory, customFromMemory) {

  //MonsterObject is just the name of the monster if loading from memory
  if (srdFromMemory) {
    MonsterObject = srdMonsterData[MonsterObject];
  }

  // Check if button with the same ID already exists to avoid multiple adding
  if (!document.getElementById(`${MonsterObject['name']}`)) {
    const monsterButton = document.createElement('button');
    monsterButton.type = 'button';
    monsterButton.className = 'btn btn-primary m-1';
    monsterButton.id = `${MonsterObject['name']}`;
    monsterButton.textContent = `${MonsterObject['name']}`;

    monsterButton.addEventListener('click', () => {

      document.getElementById('selectedListMonster').innerHTML = selectedListMonsterTemplate;

      // parse data <a href="javascript:void(0);" onclick="myFunction()">Click me</a>
      document.getElementById('selectedMonsterName').innerHTML = MonsterObject['name'];
      document.getElementById('selectedAlignment').innerHTML = MonsterObject['alignment'];
      document.getElementById('selectedSize').innerHTML = MonsterObject['size'];
      document.getElementById('selectedType').innerHTML = MonsterObject['type'];
      document.getElementById('selectedHitDice').innerHTML = MonsterObject['hit_dice'];

      document.getElementById('selectedHitDice').innerHTML = parseModString(parseDiceString(MonsterObject['hit_dice'], MonsterObject['name']), MonsterObject['name']);

      document.getElementById('selectedInitiative').innerHTML = `<a href="javascript:void(0);" onclick = "rollValue('${MonsterObject['name']} Initiative','1d20${MonsterObject['initiative']}')" > ${MonsterObject['initiative']}</a>`;
      document.getElementById('selectedSpeed').innerHTML = MonsterObject['speed'];
      document.getElementById('selectedGrapple').innerHTML = `<a href="javascript:void(0);" onclick = "rollValue('${MonsterObject['name']} Grapple','1d20${MonsterObject['grapple']}')" > ${MonsterObject['grapple']}</a>`;

      document.getElementById('selectedBaseAttack').innerHTML = `<a href="javascript:void(0);" onclick = "rollValue('${MonsterObject['name']} BaseAttack','1d20${MonsterObject['base_attack']}')" > ${MonsterObject['base_attack']}</a>`;

      document.getElementById('selectedArmorClass').innerHTML = MonsterObject['armor_class'];

      document.getElementById('selectedAttack').innerHTML = parseModString(parseDiceString(MonsterObject['attack'], MonsterObject['name']), MonsterObject['name']);

      document.getElementById('selectedFullAttack').innerHTML = parseModString(parseDiceString(MonsterObject['full_attack'], MonsterObject['name']), MonsterObject['name']);

      document.getElementById('selectedSpecialAttacks').innerHTML = parseModString(parseDiceString(MonsterObject['special_attacks'], MonsterObject['name']), MonsterObject['name']);

      document.getElementById('selectedSpaceReach').innerHTML = `${MonsterObject['space']} / ${MonsterObject['reach']}`;

      document.getElementById('selectedSpecialQualities').innerHTML = MonsterObject['special_qualities'];

      document.getElementById('selectedSaves').innerHTML = parseSaveString(` ${MonsterObject['saves']}`, MonsterObject['name']);

      document.getElementById('selectedAbilities').innerHTML = parseAbilities(MonsterObject['abilities'], MonsterObject['name']);

      MonsterAbilities = splitByWord(MonsterObject['abilities'], ',');

      let skillsHtml = "";
      if (MonsterObject['skills']) {

        const monsterSkills = parseSkills(MonsterObject['skills']);
        for (const key in monsterSkills) {
          skillsHtml = `${skillsHtml} <br> <a href="javascript:void(0);" onclick = "rollValue('${MonsterObject['name']} ${key}','1d20${monsterSkills[key]}')" > ${key} ${monsterSkills[key]}</a>`;
        }
      } else {
        skillsHtml = "-";
      }
      document.getElementById('selectedSkills').innerHTML = skillsHtml;

      //document.getElementById('selectedFeats').innerHTML = MonsterObject['feats'];
      const MonsterFeatsArray = MonsterObject['feats'].split(', ');

      for (let feat of MonsterFeatsArray) {

        const featHTML = document.createElement('a');
        featHTML.href = `#javascript.void(0)`;
        featHTML.textContent = feat;
        featHTML.id = feat.replace(/\s/g, '');

        const closeFeat = document.createElement('button');
        closeFeat.className = "btn-close m-1";
        closeFeat.onclick = function () {
          document.getElementById('feat-description-info').innerHTML = "";
          document.getElementById('feat-div-container').remove();
        }

        featHTML.onclick = function () {
          document.getElementById('feat-div-container')?.remove();

          const card = document.createElement('div');
          card.classList.add('card', 'rounded-6');
          card.id = "feat-div-container"

          const featDescriptionInfo = document.createElement('div');
          featDescriptionInfo.id = 'feat-description-info';

          card.appendChild(featDescriptionInfo);

          document.getElementById('monster-details-div').insertBefore(card, document.getElementById('monster-details-div').firstChild);

          //featName = feat.includes("Weapon Focus") && !feat.includes("Greater") ? "Weapon Focus" : feat ; // if feat includes requirement on name

          featName = feat.replace(/\(([^)]+)\)/g, ``).trim();
          console.log(featName)

          document.getElementById('feat-description-info').innerHTML = featsObj[featName] == undefined ? "Non SRD Feat found" : featsObj[featName];
          document.getElementById('feat-description-info').insertBefore(closeFeat, document.getElementById('feat-description-info').firstChild);
          document.getElementById('feat-description-info').insertAfter
        };

        // Append the link to the selectedFeats element
        document.getElementById('selectedFeats').appendChild(featHTML);
        document.getElementById('selectedFeats').appendChild(document.createElement('br'));
      }


      document.getElementById('selectedChallengeRating').innerHTML = MonsterObject['challenge_rating'];

      if (fromSrd) {
        const Monsdetails = monsterDetailsArray[MonsterObject['index']].split(`</table>`);
        const slicedDetails = Monsdetails.slice(1);
        document.getElementById('selectedDetails').innerHTML = slicedDetails.join();
      } else {
        const descriptMonster = MonsterObject['details'].replace(/\n/g, '<br>');
        document.getElementById('selectedDetails').innerHTML = descriptMonster;
      }

      //Create button to delete from list
      const deleteMonsterButton = document.createElement('button');
      deleteMonsterButton.type = 'button';
      deleteMonsterButton.className = 'btn btn-danger m-1';
      deleteMonsterButton.id = `delete-${MonsterObject['name']}`;
      deleteMonsterButton.textContent = `remove ${MonsterObject['name']} from your monsters`;
      deleteMonsterButton.addEventListener('click', () => {

        TS.localStorage.campaign.getBlob().then((storedData) => {

          let data = JSON.parse(storedData || "{}");

          const srdOrCustom = fromSrd ? "srd" : "custom";

          delete data.monsterList[srdOrCustom][MonsterObject['name']];

          TS.localStorage.campaign.setBlob(JSON.stringify(data));
        });

        document.getElementById('selectedListMonster').innerHTML = ``;
        document.getElementById(MonsterObject['name']).remove();

      });
      document.getElementById('selectedListMonster').insertBefore(deleteMonsterButton, document.getElementById('selectedListMonster').firstChild);

      document.getElementById("selected-monsters").click();
    });
    const monstersElement = document.getElementById('your-monsters');
    monstersElement.appendChild(monsterButton);

    // SAVE TO LOCALSTORAGE  
    if (!srdFromMemory && !customFromMemory) {

      if (fromSrd) {

        TS.localStorage.campaign.getBlob().then((storedData) => {

          let data = JSON.parse(storedData || "{}");
          data.monsterList["srd"][MonsterObject['name']] = MonsterObject['name'];

          TS.localStorage.campaign.setBlob(JSON.stringify(data));
        });
      }
      else {

        TS.localStorage.campaign.getBlob().then((storedData) => {

          let data = JSON.parse(storedData || "{}");
          data.monsterList["custom"][MonsterObject['name']] = MonsterObject;

          TS.localStorage.campaign.setBlob(JSON.stringify(data));
        });
      }
    }
  }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////// Export to file or Copy to Clipboard /////////////////////////////////////////////////
//true on export
function ExportMonster(ExportOrCopy) {

  const formElement = document.getElementById('customMonsterForm');

  const formData = {};
  for (const input of formElement.elements) {
    formData[input.id] = input.value;
  }

  const json = JSON.stringify(formData, null, 2);

  if (ExportOrCopy) {

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = formData.name;
    a.click();
    URL.revokeObjectURL(url);

  } else {
    TS.system.clipboard.setText(json);
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////// import monster from json ///////////////////////////////////

function ImportMonster(importedMonster) {

  const formElement = document.getElementById('customMonsterForm');

  for (const input of formElement.elements) {
    document.getElementById(input.id).value = importedMonster[input.id];
  }

}

document.getElementById('import-file-btn').addEventListener('click', () => {
  document.getElementById('import-file-input').click();
});

document.getElementById('import-file-input').addEventListener('change', (event) => {

  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    ImportMonster(JSON.parse(e.target.result));
    // ImportMonster(JSON.stringify(json, null, 2));
  };

  reader.readAsText(file);

});
/////////////////////////////////////////////////////////////////////////////////////

////////////////////// searchSrdMonster without datalist  ///////////////////////////
function searchSrdMonster() {
  document.getElementById('search-results').innerHTML = "";
  const searchTerm = document.getElementById('input-search-monster').value;

  if (searchTerm == "") {
    document.getElementById('search-results').innerHTML = "";
  } else {

    const results = [];
    for (let monsterName in srdMonsterData) {

      if (monsterName.toLowerCase().includes(searchTerm.toLowerCase())) {

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline-success btn-sm m-1 col-3';
        button.textContent = monsterName;

        button.addEventListener('click', () => {
          viewsrdmonster(monsterName);
        });

        results.push(monsterName);
        document.getElementById('search-results').appendChild(button);
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////////


function d2d3Check(name, dice) {

  try {

    let signMod = '';
    let diceModSplitted = '';
    let msg = `<br><align="center"><size=150%><color="red">${name}</color></align><br><br>`;
    let total = 0;

    if (dice.includes('+') || (!dice.includes('+') && !dice.includes('-'))) {

      signMod = '+';
      diceModSplitted = dice.split('+');

    } else if (dice.includes('-')) {

      signMod = '-';
      diceModSplitted = dice.split('-');
    }


    const diceSplitted = diceModSplitted[0].split('d');

    for (let i = 1; i < parseInt(diceSplitted[0]) + 1; i++) {

      const rolld2d3 = 1 + Math.floor(Math.random() * parseInt(diceSplitted[1]));

      diceModSplitted[1] = diceModSplitted[1] === undefined ? 0 : diceModSplitted[1];

      const result = signMod == '+' ? rolld2d3 + parseInt(diceModSplitted[1]) : rolld2d3 - parseInt(diceModSplitted[1]);

      const resultMinimum1 = result <= 0 ? 1 : result;

      total = total + resultMinimum1;

      //console.log(`roll ${rolld2d3} ${signMod} ${diceModSplitted[1]} = ${result} `)

      msg = msg + 'roll' + ` 1d${diceSplitted[1]}${signMod}${diceModSplitted[1]}   -->   <color="green">${rolld2d3}</color>${signMod}${diceModSplitted[1]} =  <color="green">${result}</color><br>`;

    }

    msg = msg + `<br><align="center"><size=200%><color="red">TOTAL: </color> <color="green">${total}`

    TS.chat.send(msg, "campaign");


  } catch (error) {
    console.warn('May be an error due to using multiple modifiers, use single modifier')
    console.error(error);
  }
}