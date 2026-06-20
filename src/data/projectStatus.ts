export type ProjectStepStatus = "completed" | "in-progress" | "pending";

export type ProjectStep = {
  id: number;
  title: string;
  status: ProjectStepStatus;
  statusLabel: string;
  description: string;
};

export type ProjectUpdate = {
  id: string;
  date: string;
  title: string;
  image?: string;
};

export const projectStatus = {
  projectName: "Hero Piece Project",
  progress: 52,
  estimatedCompletionDate: "30 มิถุนายน 2026",
  steps: [
    {
      id: 1,
      title: "รับรูปอ้างอิง",
      status: "completed",
      statusLabel: "Completed",
      description: "ตรวจสอบรูปและรายละเอียดเบื้องต้น",
    },
    {
      id: 2,
      title: "ประเมินราคา",
      status: "completed",
      statusLabel: "Completed",
      description: "สรุปขนาด รายละเอียด และค่าใช้จ่าย",
    },
    {
      id: 3,
      title: "เริ่มผลิต",
      status: "in-progress",
      statusLabel: "In Progress",
      description: "กำลังพิมพ์และประกอบชิ้นงาน",
    },
    {
      id: 4,
      title: "เก็บรายละเอียด",
      status: "pending",
      statusLabel: "Pending",
      description: "ขัดผิว ทำสี และตรวจสอบคุณภาพ",
    },
    {
      id: 5,
      title: "พร้อมส่งมอบ",
      status: "pending",
      statusLabel: "Pending",
      description: "เตรียมจัดส่งหรือรอรับด้วยตนเอง",
    },
  ] satisfies ProjectStep[],
  updates: [
    {
      id: "printing-main-parts",
      date: "12 June",
      title: "เริ่มพิมพ์ชิ้นส่วนหลัก",
    },
    {
      id: "assembly",
      date: "15 June",
      title: "ประกอบชิ้นงาน",
    },
    {
      id: "painting",
      date: "18 June",
      title: "เริ่มทำสี",
    },
  ] satisfies ProjectUpdate[],
} as const;
