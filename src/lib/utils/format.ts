@@ .. @@
 export function formatRelativeTime(date: string | Date): string {
   const now = new Date()
   const targetDate = typeof date === "string" ? new Date(date) : date
   const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
   
   if (diffInSeconds < 60) {
     return "Just now"
   } else if (diffInSeconds < 3600) {
     const minutes = Math.floor(diffInSeconds / 60)
     return `${minutes}m ago`
   } else if (diffInSeconds < 86400) {
     const hours = Math.floor(diffInSeconds / 3600)
     return `${hours}h ago`
   } else if (diffInSeconds < 604800) {
     const days = Math.floor(diffInSeconds / 86400)
     return `${days}d ago`
   } else {
     return formatDate(targetDate, { month: "short", day: "numeric" })
   }
 }