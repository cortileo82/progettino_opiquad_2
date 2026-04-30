// Formatta la stringa (es. "users:read:any" -> "Users : read - any")
export const formatPermissionName = (name: string) => {
    const parts = name.split(':');
    const category = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).replace(/_/g, ' ');
    
    if (parts.length > 1) {
        const rest = parts.slice(1).join(' - ');
        return `${category} : ${rest}`;
    }
    
    return category;
};

// Raggruppa i permessi per risorsa (una riga per ogni risorsa coinvolta)
export const groupPermissionsByCategory = (permissions: any[]) => {
    const grouped: Record<string, any[]> = {};
    
    permissions.forEach(perm => {
        const categoryKey = perm.name.split(':')[0].toLowerCase();
        
        if (!grouped[categoryKey]) {
            grouped[categoryKey] = [];
        }
        
        grouped[categoryKey].push({
            ...perm,
            formattedName: formatPermissionName(perm.name)
        });
    });
    
    return grouped;
};