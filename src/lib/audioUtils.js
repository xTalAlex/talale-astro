const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const canvas = {
  element: null,
  context: null,
};

function autoCorrelate(buffer, sampleRate, threshold = 0.2) {
  // Perform a quick root-mean-square to see if we have enough signal
  var SIZE = buffer.length;
  var sumOfSquares = 0;
  for (var i = 0; i < SIZE; i++) {
    var val = buffer[i];
    sumOfSquares += val * val;
  }
  var rootMeanSquare = Math.sqrt(sumOfSquares / SIZE);
  if (rootMeanSquare < 0.01) {
    return -1;
  }

  // Find a range in the buffer where the values are below a given threshold.
  var r1 = 0;
  var r2 = SIZE - 1;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < threshold) {
      r2 = SIZE - i;
      break;
    }
  }

  // Trim the buffer to these ranges and update SIZE.
  buffer = buffer.slice(r1, r2);
  SIZE = buffer.length;

  // Create a new array of the sums of offsets to do the autocorrelation
  // For each potential offset, calculate the sum of each buffer value times its offset value
  var c = new Array(SIZE).fill(0);
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j + i];
    }
  }

  // Find the last index where that value is greater than the next one (the dip)
  var d = 0;
  while (c[d] > c[d + 1]) {
    d++;
  }

  // Iterate from that index through the end and find the maximum sum
  var maxValue = -1;
  var maxIndex = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxValue) {
      maxValue = c[i];
      maxIndex = i;
    }
  }

  var T0 = maxIndex;

  var x1 = c[T0 - 1];
  var x2 = c[T0];
  var x3 = c[T0 + 1];

  var a = (x1 + x3 - 2 * x2) / 2;
  var b = (x3 - x1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
}

function noteFromPitch(frequency) {
  var noteNum = noteNames.length * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function setupCanvasContext(canvasEl) {
  canvas.element = canvasEl;
  canvas.context = canvas.element.getContext("2d");
  canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);
}

function drawWave(audioData) {
  canvas.context.fillStyle = "rgb(255, 255, 255)";
  canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);

  canvas.context.lineWidth = 2;
  canvas.context.strokeStyle = "rgb(0, 0, 0)";
  canvas.context.beginPath();

  const sliceWidth = (canvas.element.width * 1.0) / audioData.length;
  let x = 0;

  for (let i = 0; i < audioData.length; i++) {
    const v = audioData[i] / 128.0;
    const y = v * (canvas.element.height / 2);

    if (i === 0) {
      canvas.context.moveTo(x, y);
    } else {
      canvas.context.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvas.context.lineTo(canvas.element.width, canvas.element.height / 2);
  canvas.context.stroke();
}

function drawSpectrum(audioData) {
  canvas.context.fillStyle = "rgb(255, 255, 255)";
  canvas.context.clearRect(0, 0, canvas.element.width, canvas.element.height);

  var barWidth = (canvas.element.width / audioData.length) * 2.5;
  var barHeight;
  var x = 0;
  for (var i = 0; i < audioData.length; i++) {
    barHeight = audioData[i];

    canvas.context.fillStyle =
      "rgb(" +
      (255 - barHeight) +
      "," +
      (255 - barHeight) +
      "," +
      (255 - barHeight) +
      ")";
    canvas.context.fillRect(
      x,
      canvas.element.height - barHeight / 2,
      barWidth,
      barHeight / 2,
    );

    x += barWidth + 1;
  }
}

function getPitch(buffer, sampleRate, threshold = 0.2) {
  var autoCorrelateValue = autoCorrelate(buffer, sampleRate, threshold);
  var frequency = Math.round(autoCorrelateValue);
  var note =
    noteNames[
      audioUtils.noteFromPitch(autoCorrelateValue) % noteNames.length
    ] ?? null;

  return { frequency, note };
}

function pitchIsSimilarTo(value, otherValue, threshold = 5) {
  return Math.abs(value - otherValue) < threshold;
}

export const audioUtils = {
  noteNames,
  canvas,
  autoCorrelate,
  noteFromPitch,
  getPitch,
  pitchIsSimilarTo,
  setupCanvasContext,
  drawWave,
  drawSpectrum,
};
