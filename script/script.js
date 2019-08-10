const submit = document.querySelector('#submit');
const form1 = document.form1;

submit.addEventListener('click', () =>{
 mainJob();
});


const mainJob = () => {
  const label = document.querySelector('#label');
  const voltage = document.querySelector('#voltage');
  const current = document.querySelector('#current');
  const width = document.querySelector('#area1');
  const height = document.querySelector('#area2');

  const labelText = label.value;
  const vData = voltage.value.split('\n');
  const iData = current.value.split('\n');
  const area = Number(width.value) * Number(height.value);

  const jData = getCurrentDensity(iData, area);
  const Voc = findVoc(vData, jData);
  const Jsc = findJsc(vData, jData);
  const eff = findEff(vData, jData);
  const ff = calcFF(Voc, Jsc, eff);

  printData(labelText, Voc, Jsc, ff, eff);
  plotIV(vData, jData, labelText);
}


const getCurrentDensity = (i, area) => {
  const j = i.map(item => {
    if (Number(item) > 0) {
      return 0;
    }

    return (-1 * Number(item)) / area;
  });

  return j;
};

const findVoc = (v, j) => {
  const filteredV = v.map((item, index) => {
    if (j[index] > 0) {
      return Number(item);
    } else {
      return 0;
    }
  });

  const voc = Math.max(...filteredV);

  return voc;
};


const findJsc = (v, j) => {
  const filteredJ = j.map((item, index) => {
    if (v[index] > 0) {
      return Number(item);
    } else {
      return 0;
    }
  });

  const jsc = Math.max(...filteredJ);

  return round(jsc);
};

const findEff = (v, j) => {
  const pw = v.map((vValue, index) => {
    const jValue = Math.abs(j[index]);

    return vValue * (jValue);
  });

  const maxPw = Math.max(...pw);

  return round(maxPw);
};

const calcFF = (voc, jsc, eff) => {
  const ff = eff / (voc * jsc);

  return round(ff);
};

const round = (x) => Math.round(1000 *x) / 1000;

const printData = (label, v, j, ff, ef) => {
  const table = document.querySelector('table');
  const tr = document.createElement('tr');
  tr.innerHTML = `
        <td>${label} </td>
        <td>${v} </td>
        <td>${j} </td>
        <td>${ff} </td>
        <td>${ef} </td>
  `;

  table.appendChild(tr);
}

const plotIV = (v, j, label) => {
  const ctx = document.getElementById('myChart').getContext('2d');
  const poltData = v.map((item, index) => {
    return {
      x: item,
      y: j[index],
    }
  });

  const refinedPlotData = poltData.filter(item => {
    return item['x'] > 0 && item['y'] > 0; 
  });

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const scatterChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
          label: label,
          data: refinedPlotData,
          borderColor: getRandomColor(),
        }]
    },
    options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom',
            }]
        },
        options: {
          elements: {
              point:{
                  radius: 0
              }
          }
      }
    }
});
}