import { Link } from "react-router-dom";
import { Card } from "flowbite-react";
import { ReactNode } from "react";

interface BaseCardProps {
  title: string;
  description?: string; // Used for App Dashboard
  value?: number; // Used for Stats
  icon: ReactNode;
  to?: string; // If provided, turns into a clickable link
}

const BaseCard = ({ title, description, value, icon, to }: BaseCardProps) => {
  const cardContent = (
    <Card className="flex items-center justify-between p-4 shadow-md rounded-lg dark:bg-gray-900 hover:scale-105 transition">
      <div className="text-3xl text-gray-900 dark:text-gray-400">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        {description && <p className="text-sm text-gray-400">{description}</p>}
        {value !== undefined && <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>}
      </div>
    </Card>
  );

  return to ? <Link to={to}>{cardContent}</Link> : cardContent;
};

export default BaseCard;
