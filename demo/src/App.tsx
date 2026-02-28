import { useState } from "react";
import { Select } from "custom-react-select";

const frameworks = [
  { id: 1, name: "React", category: "Frontend" },
  { id: 2, name: "Next.js", category: "Fullstack" },
  { id: 3, name: "Go", category: "Backend" },
];

const MyComponent = () => {
  const [value, setValue] = useState(null);

  return (
    <Select
      label="Select Framework"
      options={frameworks}
      value={value}
      onChange={setValue}
      withSearch={true}
      placeholder="Search frameworks..."
      multiple
      required
    />
  );
};
export default MyComponent;
