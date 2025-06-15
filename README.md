
# Laplacian Blur Detector

📷 **blurMeter** is a compact JavaScript utility that measures image sharpness using the **Variance of Laplacian** algorithm.  
It returns an intuitive **score from 1 (very blurry) to 10 (perfectly sharp)**, making it ideal for client-side validation, image quality control, or pre-processing for OCR and computer vision tasks.

---

## ✨ Features

- ✅ Pure JavaScript – no dependencies
- 📈 Laplacian-based blur detection (4-neighbor kernel)
- 🔢 Returns a normalized **sharpness score [1–10]**
- 🧠 Customizable threshold range
- 🖼️ Supports `HTMLImageElement`, `HTMLVideoElement`, `HTMLCanvasElement`, and `ImageBitmap`
- ⚡ Fast enough for real-time use

---

## 🚀 Installation

You can use it directly in the browser or bundle it with your toolchain.

### Browser (ESM)
```html
<script type="module">
  import blurMeter from './js/blur-meter.js';

  const img = document.querySelector('img');
  const { score, variance } = await blurMeter(img);
  console.log('Sharpness score:', score);
</script>
```

### Node / Bundler
```bash
npm install your-repo-or-path
```

Then:
```js
import blurMeter from 'blur-meter';
```

---

## 🔬 Algorithm

**Variance of Laplacian** is a well-established method for blur detection. It computes a grayscale version of the image, applies a Laplacian filter (edge enhancement), and calculates the statistical variance of the result:

```
Sharpness ∝ Var( Laplacian( Grayscale(Image) ) )
```

This implementation uses a fast **4-neighbor Laplacian**:

```
L[x,y] = 4*I[x,y] - I[x-1,y] - I[x+1,y] - I[x,y-1] - I[x,y+1]
```

---

## 📊 API

```ts
async function blurMeter(
  source: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | ImageBitmap,
  opts?: {
    thresholdMin?: number, // variance mapped to score 1 (default: 25)
    thresholdMax?: number  // variance mapped to score 10 (default: 10000)
  }
): Promise<{ score: number, variance: number }>
```

### Example
```js
const img = document.querySelector('img');
const { score, variance } = await blurMeter(img);
console.log(`Score: ${score} (variance: ${variance.toFixed(2)})`);
```

---

## 🎛️ Threshold tuning

| Use case | Suggested range |
|----------|------------------|
| Low-res camera preview (≤ 640px) | 10 – 150 |
| HD photo (1280×720) | 25 – 200 |
| OCR preprocessing | 30 – 300 |
| General purpose | 25 – 10,000 (default) |

Adjust `thresholdMin` and `thresholdMax` to map the variance range to the score scale more meaningfully for your dataset.

---

## 📁 Project structure

```
blurMeter/
├── js/
│   └── blur-meter.js         # main implementation
├── index.html            # test interface
└── README.md
```

---

## 🧠 Author

**Simone Renzi**  
Engineer, full-stack developer, founder of RENOR & Partners Srl  
🌐 [simonerenzi.com](https://simonerenzi.com) • [renor.it](https://renor.it)

---

## 📝 License

MIT License — free to use, modify and distribute.

---

## ⭐️ Support the Project

If this helped your project, please **star** the repo or mention `blurMeter` in your credits! PRs and improvements are welcome.
