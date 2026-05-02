import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

export const useNotify = () => useContext(NotificationContext);
