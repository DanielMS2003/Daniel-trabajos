window.addEventListener('DOMContentLoaded', function() {
    var pairingsDiv = document.getElementById('pairings');
    var fileInput = document.getElementById('fileInput');
    var uploadContainer = document.getElementById('uploadContainer');
    var manualInputContainer = document.getElementById('manualInputContainer');
    var nameInput = document.getElementById('nameInput');
    var addNameButton = document.getElementById('addNameButton');
    var pairNamesButton = document.getElementById('pairNamesButton');
    var toggleButton = document.getElementById('toggleButton');
    var names = [];
  
    fileInput.addEventListener('change', function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
  
      reader.onload = function(e) {
        names = e.target.result.split('\n').filter(name => name.trim() !== '');
        showPairings(generatePairings(names));
      };
  
      reader.readAsText(file);
  
      fileInput.value = '';
    });
  
    addNameButton.addEventListener('click', function() {
      var name = nameInput.value.trim();
      if (name !== '') {
        names.push(name);
        nameInput.value = '';
        showPairings(generatePairings(names));
      }
    });
  
    pairNamesButton.addEventListener('click', function() {
      var namesString = nameInput.value.trim();
      var namesArray = namesString.split(',').map(name => name.trim());
      showPairings(generatePairings(namesArray));
    });
  
    toggleButton.addEventListener('click', function() {
      toggleInputMode();
    });
  
    function generatePairings(names) {
      var pairings = [];
  
      while (names.length > 0) {
        var randomIndex1 = Math.floor(Math.random() * names.length);
        var name1 = names.splice(randomIndex1, 1)[0];
  
        var randomIndex2 = Math.floor(Math.random() * names.length);
        var name2 = names.splice(randomIndex2, 1)[0];
  
        pairings.push([name1, name2]);
      }
  
      if (names.length > 0) {
        pairings.push([names[0], '']);
      }
  
      return pairings;
    }
  
    function showPairings(pairings) {
      if (pairings.length === 0) {
        pairingsDiv.innerHTML = 'No pairings available.';
        return;
      }
  
      var html = '<table><thead><tr><th>Pair 1</th><th>Pair 2</th></tr></thead><tbody>';
  
      pairings.forEach(pair => {
        html += `<tr><td>${pair[0]}</td><td>${pair[1]}</td></tr>`;
      });
  
      html += '</tbody></table>';
      pairingsDiv.innerHTML = html;
    }
  
    function toggleInputMode() {
      uploadContainer.classList.toggle('hidden');
      manualInputContainer.classList.toggle('hidden');
    }
  });  