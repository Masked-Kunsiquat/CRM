import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiCog,
  HiInbox,
  HiShoppingBag,
  HiUser,
} from "react-icons/hi";

const GlobalSidebar = () => {
  return (
    <Sidebar aria-label="Global Sidebar">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Main Dashboard */}
          <Sidebar.Item as={Link} to="/" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>

          {/* Apps Section */}
          <Sidebar.Collapse icon={HiShoppingBag} label="Apps">
            <Sidebar.Item as={Link} to="/crm">CRM</Sidebar.Item>
            <Sidebar.Item as={Link} to="/mood-tracker">Mood Tracker</Sidebar.Item>
            <Sidebar.Item as={Link} to="/gas-tracker">Gas Tracker</Sidebar.Item>
          </Sidebar.Collapse>

          {/* Inbox (Placeholder, can be replaced with notifications/messages) */}
          <Sidebar.Item as={Link} to="/inbox" icon={HiInbox}>
            Inbox
          </Sidebar.Item>

          {/* User Profile (Could link to profile settings later) */}
          <Sidebar.Item as={Link} to="/profile" icon={HiUser}>
            Profile
          </Sidebar.Item>

          {/* Settings with Dropdown */}
          <Sidebar.Collapse icon={HiCog} label="Settings">
            <Sidebar.Item as={Link} to="/settings">General Settings</Sidebar.Item>
            <Sidebar.Item as={Link} to="/settings/crm">CRM Settings</Sidebar.Item>
            <Sidebar.Item as={Link} to="/settings/mood-tracker">Mood Tracker Settings</Sidebar.Item>
            <Sidebar.Item as={Link} to="/settings/gas-tracker">Gas Tracker Settings</Sidebar.Item>
          </Sidebar.Collapse>

          {/* Logout */}
          <Sidebar.Item as={Link} to="/logout" icon={HiArrowSmRight}>
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default GlobalSidebar;
