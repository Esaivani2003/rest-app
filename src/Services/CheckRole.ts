 export const getUserRole = (): string | null => {
    if (typeof window === "undefined") return null;
  
    try {
      const user = localStorage.getItem("user");
      if (!user) return null;
  
      const parsedUser = JSON.parse(user);
      return parsedUser.role || null;
    } catch (error) {
      console.error("Error retrieving user role:", error);
      return null;
    }
  };
  
  export const isUser = (): boolean => getUserRole() === "user";
  export const isAdmin = (): boolean => getUserRole() === "admin";
  export const isChef = (): boolean => getUserRole() === "chef";
  export const isWaiter = (): boolean => getUserRole() === "waiter";
  
  // ✅ Authenticated if any valid role exists
  export const isAuthenticated = (): boolean => {
    const role = getUserRole();
    return [ "admin", "chef", "waiter"].includes(role || "");
  };
  export const getUserInfo = (): { name: string | null; role: string | null } => {
    if (typeof window === "undefined") return { name: null, role: null };
  
    try {
      const user = localStorage.getItem("user");
      if (!user) return { name: null, role: null };
  
      const parsedUser = JSON.parse(user);
      return {
        name: parsedUser.name || null,
        role: parsedUser.role || null,
      };
    } catch (error) {
      console.error("Error retrieving user info:", error);
      return { name: null, role: null };
    }
  };
  