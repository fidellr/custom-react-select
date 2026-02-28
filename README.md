# Custom React Select

A high-performance, customizable, accessible, and fully typed Select component built with **React**, **TypeScript**, and **Tailwind CSS**. Designed to handle complex data structures with full keyboard navigation support and smart data detection.

## Features

- Automatically detects labels and unique IDs from your data objects (supports `id`, `value`, `name`, and `label` keys).
- **Keyboard Accessible**: Full support for `↑`, `↓`, `Enter`, and `Esc` keys with automatic scroll-into-view.
- Uses React Portals to prevent `z-index` or `overflow: hidden` clipping in complex layouts.
- **Searchable**: Integrated search with fuzzy filtering and text highlighting.
- **Multi-Select**: Toggle between single selection and chip-based multi-selection with ease.
- **Tailwind Powered**: Style-ready with standard Tailwind classes and easy theme overrides.

---

## Installation (Local)

Since this package is not yet on NPM, you can use it in your project via `npm link`:

1. **In this project folder:**

```bash
npm run build
npm link

```

2. **In your main application folder:**

```bash
npm link custom-react-select

```

---

## Quick Start

```tsx
import { useState } from "react";
import { Select } from "custom-react-select";

// Component automatically detects 'id' for the key and 'name' for the label
const frameworks = [
  { id: 1, name: "React", category: "Frontend" },
  { id: 2, name: "Next.js", category: "Fullstack" },
  { id: 3, name: "Go", category: "Backend" },
];

export const MyComponent = () => {
  const [value, setValue] = useState(null);

  return (
    <Select
      label="Select Framework"
      options={frameworks}
      value={value}
      onChange={setValue}
      withSearch={true}
      placeholder="Search frameworks..."
    />
  );
};
```

---

## Component Props

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>options</code></td>
      <td><code>T[]</code></td>
      <td><code>[]</code></td>
      <td>Array of data objects or strings.</td>
    </tr>
    <tr>
      <td><code>value</code></td>
      <td><code>T | T[] | null</code></td>
      <td><code>null</code></td>
      <td>Current selection state.</td>
    </tr>
    <tr>
      <td><code>onChange</code></td>
      <td><code>(val: any) => void</code></td>
      <td>—</td>
      <td>Callback triggered on selection changes.</td>
    </tr>
    <tr>
      <td><code>label</code></td>
      <td><code>ReactNode</code></td>
      <td>—</td>
      <td>Visual label displayed above the input.</td>
    </tr>
    <tr>
      <td><code>multiple</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables multi-select (Chip/Tag) mode.</td>
    </tr>
    <tr>
      <td><code>withSearch</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Enables search input inside the dropdown.</td>
    </tr>
    <tr>
      <td><code>outlined</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Uses a thick-border UI style.</td>
    </tr>
    <tr>
      <td><code>usePortal</code></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
      <td>Renders the dropdown menu into <code>document.body</code>.</td>
    </tr>
    <tr>
      <td><code>placeholder</code></td>
      <td><code>string</code></td>
      <td><code>'Select...'</code></td>
      <td>Text shown when selection is empty.</td>
    </tr>
    <tr>
      <td><code>searchPlaceholder</code></td>
      <td><code>string</code></td>
      <td><code>'Search...'</code></td>
      <td>Placeholder text for the search input.</td>
    </tr>
    <tr>
      <td><code>error</code></td>
      <td><code>string | boolean</code></td>
      <td>—</td>
      <td>Displays error message and red border.</td>
    </tr>
    <tr>
      <td><code>disabled</code></td>
      <td><code>boolean</code></td>
      <td><code>false</code></td>
      <td>Disables all user interactions.</td>
    </tr>
    <tr>
      <td><code>renderOption</code></td>
      <td><code>(opt: T, selected: bool) => ReactNode</code></td>
      <td>—</td>
      <td>Custom render function for list items.</td>
    </tr>
    <tr>
      <td><code>className</code></td>
      <td><code>string</code></td>
      <td>—</td>
      <td>Custom classes for the trigger button.</td>
    </tr>
    <tr>
      <td><code>containerClassName</code></td>
      <td><code>string</code></td>
      <td>—</td>
      <td>Custom classes for the outer wrapper.</td>
    </tr>
  </tbody>
</table>

---

## Tailwind Configuration

Update your `tailwind.config.js` to ensure the component's utility classes are generated:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/custom-react-select/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

---

## Development

```bash
npm install     # Install dependencies
npm run dev     # Launch Storybook environment
npm run build   # Generate production /dist folder

```
