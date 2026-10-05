import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  return (
    <div className="mb-2">
      {items.map((item, i) => (
        <span key={i} className="text-gray-600 text-sm">
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          {i < items.length - 1 && " > "}
        </span>
      ))}
    </div>
  );
}

export default Breadcrumb;