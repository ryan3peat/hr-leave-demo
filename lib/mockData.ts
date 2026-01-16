import { Employee, LeaveRequest, EmployeeGrade, LeaveType, LeaveStatus, LeaveDuration } from "./types";

/**
 * Generate comprehensive mock data for the HR Leave Management System
 * Includes 25 diverse employees and 120+ realistic leave records
 */

// Employee names pool
const FIRST_NAMES = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Christopher", "Karen", "Daniel", "Nancy", "Matthew", "Lisa",
  "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra"
];

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
  "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez",
  "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young"
];

// Department list
const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations",
  "IT",
  "Customer Support",
];

/**
 * Generate a random employee
 */
function generateEmployee(
  id: string,
  name: string,
  grade: EmployeeGrade,
  department: string,
  startYear: number,
  startMonth: number,
  startDay: number
): Employee {
  const email = `${name.toLowerCase().replace(/\s+/g, ".")}@company.com`;
  return {
    id,
    name,
    email,
    grade,
    department,
    firstDayOfWork: new Date(startYear, startMonth, startDay),
  };
}

/**
 * Generate employees with diverse profiles
 */
export const MOCK_EMPLOYEES: Employee[] = [
  // Long-tenured employees (2010-2012) - 11+ years
  generateEmployee("emp001", "Denis Ma", "Executive", "Engineering", 2010, 0, 15),
  generateEmployee("emp002", "Mary Johnson", "Senior", "Sales", 2011, 2, 20),
  generateEmployee("emp003", "John Williams", "Senior", "Marketing", 2012, 5, 10),
  generateEmployee("emp004", "Patricia Brown", "Mid", "HR", 2011, 8, 5),
  
  // Mid-tenured employees (2013-2018) - 6-10 years
  generateEmployee("emp005", "Robert Jones", "Senior", "Finance", 2013, 1, 12),
  generateEmployee("emp006", "Jennifer Garcia", "Mid", "Operations", 2014, 3, 25),
  generateEmployee("emp007", "Michael Miller", "Senior", "IT", 2015, 6, 8),
  generateEmployee("emp008", "Linda Davis", "Executive", "Customer Support", 2016, 0, 18),
  generateEmployee("emp009", "William Rodriguez", "Mid", "Engineering", 2017, 4, 22),
  generateEmployee("emp010", "Elizabeth Martinez", "Senior", "Sales", 2018, 7, 14),
  
  // Recent employees (2019-2022) - 3-5 years
  generateEmployee("emp011", "David Hernandez", "Junior", "Marketing", 2019, 2, 5),
  generateEmployee("emp012", "Barbara Lopez", "Mid", "HR", 2020, 5, 20),
  generateEmployee("emp013", "Richard Wilson", "Senior", "Finance", 2021, 0, 10),
  generateEmployee("emp014", "Susan Anderson", "Mid", "Operations", 2021, 8, 15),
  generateEmployee("emp015", "Joseph Thomas", "Junior", "IT", 2022, 3, 8),
  
  // New joiners (2023-2024) - 0-2 years
  generateEmployee("emp016", "Jessica Taylor", "Junior", "Customer Support", 2023, 1, 12),
  generateEmployee("emp017", "Thomas Moore", "Mid", "Engineering", 2023, 6, 25),
  generateEmployee("emp018", "Sarah Jackson", "Junior", "Sales", 2023, 9, 5),
  generateEmployee("emp019", "Christopher Martin", "Senior", "Marketing", 2024, 0, 8),
  generateEmployee("emp020", "Karen Lee", "Mid", "HR", 2024, 2, 18),
  generateEmployee("emp021", "Daniel Thompson", "Junior", "Finance", 2024, 4, 22),
  generateEmployee("emp022", "Nancy White", "Executive", "Operations", 2024, 6, 10),
  generateEmployee("emp023", "Matthew Harris", "Mid", "IT", 2024, 8, 15),
  generateEmployee("emp024", "Lisa Sanchez", "Junior", "Customer Support", 2024, 10, 5),
  generateEmployee("emp025", "Anthony Clark", "Senior", "Engineering", 2024, 11, 20),
];

/**
 * Generate realistic leave records
 * Patterns: More leave in summer (June-Aug) and December
 */
function generateLeaveRequest(
  id: string,
  employeeId: string,
  year: number,
  month: number,
  day: number,
  duration: number,
  leaveType: LeaveType,
  status: LeaveStatus,
  durationType: LeaveDuration = "Full Day"
): LeaveRequest {
  const startDate = new Date(year, month, day);
  const endDate = new Date(year, month, day + duration - 1);
  const submittedAt = new Date(year, month, day - 7); // Submitted 7 days before
  
  return {
    id,
    employeeId,
    startDate,
    endDate,
    leaveType,
    duration: durationType,
    status,
    submittedAt,
  };
}

/**
 * Generate comprehensive leave history
 */
export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  // 2024 Leave Records (Current Year)
  // Summer leave (June-August) - High volume
  generateLeaveRequest("leave001", "emp001", 2024, 5, 15, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave002", "emp002", 2024, 5, 20, 3, "Personal", "Approved"),
  generateLeaveRequest("leave003", "emp003", 2024, 6, 1, 7, "Vacation", "Approved"),
  generateLeaveRequest("leave004", "emp004", 2024, 6, 10, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave005", "emp005", 2024, 6, 15, 4, "Personal", "Approved"),
  generateLeaveRequest("leave006", "emp006", 2024, 6, 20, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave007", "emp007", 2024, 7, 1, 10, "Vacation", "Approved"),
  generateLeaveRequest("leave008", "emp008", 2024, 7, 8, 3, "Personal", "Approved"),
  generateLeaveRequest("leave009", "emp009", 2024, 7, 15, 6, "Vacation", "Approved"),
  generateLeaveRequest("leave010", "emp010", 2024, 7, 22, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave011", "emp011", 2024, 7, 25, 4, "Personal", "Approved"),
  generateLeaveRequest("leave012", "emp012", 2024, 8, 5, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave013", "emp013", 2024, 8, 12, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave014", "emp014", 2024, 8, 18, 7, "Vacation", "Approved"),
  
  // December leave - High volume
  generateLeaveRequest("leave015", "emp001", 2024, 11, 20, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave016", "emp002", 2024, 11, 23, 3, "Personal", "Approved"),
  generateLeaveRequest("leave017", "emp003", 2024, 11, 24, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave018", "emp005", 2024, 11, 20, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave019", "emp006", 2024, 11, 23, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave020", "emp007", 2024, 11, 24, 3, "Personal", "Approved"),
  generateLeaveRequest("leave021", "emp008", 2024, 11, 20, 6, "Vacation", "Approved"),
  generateLeaveRequest("leave022", "emp009", 2024, 11, 23, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave023", "emp010", 2024, 11, 24, 4, "Vacation", "Approved"),
  
  // Other 2024 leave
  generateLeaveRequest("leave024", "emp001", 2024, 1, 10, 2, "Sick Leave", "Approved"),
  generateLeaveRequest("leave025", "emp002", 2024, 2, 5, 1, "Medical", "Approved"),
  generateLeaveRequest("leave026", "emp003", 2024, 3, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave027", "emp004", 2024, 3, 20, 2, "Personal", "Approved"),
  generateLeaveRequest("leave028", "emp005", 2024, 4, 8, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave029", "emp006", 2024, 4, 12, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave030", "emp007", 2024, 4, 18, 2, "Medical", "Approved"),
  generateLeaveRequest("leave031", "emp008", 2024, 5, 5, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave032", "emp009", 2024, 5, 10, 1, "Personal", "Approved"),
  generateLeaveRequest("leave033", "emp010", 2024, 9, 10, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave034", "emp011", 2024, 9, 15, 2, "Personal", "Approved"),
  generateLeaveRequest("leave035", "emp012", 2024, 9, 20, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave036", "emp013", 2024, 10, 5, 2, "Sick Leave", "Approved"),
  generateLeaveRequest("leave037", "emp014", 2024, 10, 12, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave038", "emp015", 2024, 10, 18, 1, "Medical", "Approved"),
  
  // Pending requests
  generateLeaveRequest("leave039", "emp001", 2024, 11, 28, 3, "Vacation", "Pending"),
  generateLeaveRequest("leave040", "emp002", 2024, 11, 30, 2, "Personal", "Pending"),
  generateLeaveRequest("leave041", "emp003", 2025, 0, 5, 4, "Vacation", "Pending"),
  generateLeaveRequest("leave042", "emp004", 2025, 0, 8, 2, "Vacation", "Pending"),
  generateLeaveRequest("leave043", "emp005", 2025, 0, 10, 5, "Vacation", "Pending"),
  generateLeaveRequest("leave044", "emp006", 2025, 0, 12, 3, "Personal", "Pending"),
  generateLeaveRequest("leave045", "emp007", 2025, 0, 15, 2, "Vacation", "Pending"),
  generateLeaveRequest("leave046", "emp008", 2025, 0, 18, 4, "Vacation", "Pending"),
  
  // 2026 Leave Records (for calendar visibility)
  generateLeaveRequest("leave200", "emp001", 2026, 0, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave201", "emp002", 2026, 0, 20, 2, "Personal", "Approved"),
  generateLeaveRequest("leave202", "emp003", 2026, 0, 25, 4, "Vacation", "Pending"),
  generateLeaveRequest("leave203", "emp004", 2026, 1, 5, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave204", "emp005", 2026, 1, 10, 2, "Personal", "Pending"),
  generateLeaveRequest("leave205", "emp006", 2026, 1, 15, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave206", "emp007", 2026, 2, 1, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave207", "emp008", 2026, 2, 8, 2, "Personal", "Pending"),
  generateLeaveRequest("leave208", "emp009", 2026, 2, 12, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave209", "emp010", 2026, 2, 18, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave210", "emp011", 2026, 3, 5, 2, "Personal", "Pending"),
  generateLeaveRequest("leave211", "emp012", 2026, 3, 10, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave212", "emp013", 2026, 3, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave213", "emp014", 2026, 4, 2, 2, "Personal", "Pending"),
  generateLeaveRequest("leave214", "emp015", 2026, 4, 8, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave215", "emp016", 2026, 4, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave216", "emp017", 2026, 5, 1, 2, "Personal", "Pending"),
  generateLeaveRequest("leave217", "emp018", 2026, 5, 10, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave218", "emp019", 2026, 5, 20, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave219", "emp020", 2026, 6, 5, 2, "Personal", "Pending"),
  generateLeaveRequest("leave220", "emp021", 2026, 6, 12, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave221", "emp022", 2026, 6, 20, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave222", "emp023", 2026, 7, 1, 2, "Personal", "Pending"),
  generateLeaveRequest("leave223", "emp024", 2026, 7, 8, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave224", "emp025", 2026, 7, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave225", "emp001", 2026, 8, 1, 2, "Personal", "Pending"),
  generateLeaveRequest("leave226", "emp002", 2026, 8, 10, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave227", "emp003", 2026, 8, 18, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave228", "emp004", 2026, 9, 5, 2, "Personal", "Pending"),
  generateLeaveRequest("leave229", "emp005", 2026, 9, 12, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave230", "emp006", 2026, 9, 20, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave231", "emp007", 2026, 10, 1, 2, "Personal", "Pending"),
  generateLeaveRequest("leave232", "emp008", 2026, 10, 8, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave233", "emp009", 2026, 10, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave234", "emp010", 2026, 11, 1, 2, "Personal", "Pending"),
  generateLeaveRequest("leave235", "emp011", 2026, 11, 10, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave236", "emp012", 2026, 11, 18, 3, "Vacation", "Approved"),
  
  // January 2026 Leave Records (for calendar visibility)
  generateLeaveRequest("leave300", "emp001", 2026, 0, 5, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave301", "emp002", 2026, 0, 8, 3, "Personal", "Pending"),
  generateLeaveRequest("leave302", "emp003", 2026, 0, 12, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave303", "emp004", 2026, 0, 15, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave304", "emp005", 2026, 0, 18, 2, "Personal", "Pending"),
  generateLeaveRequest("leave305", "emp006", 2026, 0, 22, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave306", "emp007", 2026, 0, 25, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave307", "emp008", 2026, 0, 28, 4, "Personal", "Pending"),
  generateLeaveRequest("leave308", "emp009", 2026, 0, 10, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave309", "emp010", 2026, 0, 14, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave310", "emp011", 2026, 0, 20, 3, "Personal", "Pending"),
  generateLeaveRequest("leave311", "emp012", 2026, 0, 24, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave312", "emp013", 2026, 0, 27, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave313", "emp014", 2026, 0, 30, 2, "Personal", "Pending"),
  generateLeaveRequest("leave314", "emp015", 2026, 0, 3, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave315", "emp016", 2026, 0, 7, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave316", "emp017", 2026, 0, 11, 3, "Personal", "Pending"),
  generateLeaveRequest("leave317", "emp018", 2026, 0, 16, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave318", "emp019", 2026, 0, 19, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave319", "emp020", 2026, 0, 23, 2, "Personal", "Pending"),
  generateLeaveRequest("leave320", "emp021", 2026, 0, 26, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave321", "emp022", 2026, 0, 29, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave322", "emp023", 2026, 0, 2, 3, "Personal", "Pending"),
  generateLeaveRequest("leave323", "emp024", 2026, 0, 6, 2, "Vacation", "Approved"),
  generateLeaveRequest("leave324", "emp025", 2026, 0, 9, 4, "Vacation", "Approved"),
  
  // Rejected requests
  generateLeaveRequest("leave047", "emp009", 2024, 6, 25, 10, "Vacation", "Rejected"),
  generateLeaveRequest("leave048", "emp010", 2024, 7, 30, 8, "Personal", "Rejected"),
  generateLeaveRequest("leave049", "emp011", 2024, 8, 25, 12, "Vacation", "Rejected"),
  
  // Half-day leaves
  generateLeaveRequest("leave050", "emp012", 2024, 3, 10, 1, "Personal", "Approved", "Half Day AM"),
  generateLeaveRequest("leave051", "emp013", 2024, 3, 15, 1, "Medical", "Approved", "Half Day PM"),
  generateLeaveRequest("leave052", "emp014", 2024, 4, 20, 1, "Personal", "Approved", "Half Day AM"),
  generateLeaveRequest("leave053", "emp015", 2024, 5, 15, 1, "Sick Leave", "Approved", "Half Day PM"),
  
  // Non-annual leave types
  generateLeaveRequest("leave054", "emp001", 2024, 1, 20, 3, "Bereavement", "Approved"),
  generateLeaveRequest("leave055", "emp002", 2024, 2, 10, 5, "Parental", "Approved"),
  generateLeaveRequest("leave056", "emp003", 2024, 3, 5, 2, "Bereavement", "Approved"),
  generateLeaveRequest("leave057", "emp004", 2024, 4, 15, 4, "Medical", "Approved"),
  generateLeaveRequest("leave058", "emp005", 2024, 5, 20, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave059", "emp006", 2024, 6, 5, 2, "Medical", "Approved"),
  generateLeaveRequest("leave060", "emp007", 2024, 7, 12, 3, "Sick Leave", "Approved"),
  generateLeaveRequest("leave061", "emp008", 2024, 8, 8, 1, "Medical", "Approved"),
  generateLeaveRequest("leave062", "emp009", 2024, 9, 25, 2, "Bereavement", "Approved"),
  generateLeaveRequest("leave063", "emp010", 2024, 10, 20, 6, "Parental", "Approved"),
  
  // 2023 Leave Records
  generateLeaveRequest("leave064", "emp001", 2023, 5, 20, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave065", "emp002", 2023, 6, 15, 7, "Vacation", "Approved"),
  generateLeaveRequest("leave066", "emp003", 2023, 7, 10, 4, "Personal", "Approved"),
  generateLeaveRequest("leave067", "emp004", 2023, 8, 5, 6, "Vacation", "Approved"),
  generateLeaveRequest("leave068", "emp005", 2023, 11, 20, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave069", "emp006", 2023, 11, 24, 3, "Personal", "Approved"),
  generateLeaveRequest("leave070", "emp007", 2023, 1, 10, 2, "Sick Leave", "Approved"),
  generateLeaveRequest("leave071", "emp008", 2023, 3, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave072", "emp009", 2023, 4, 20, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave073", "emp010", 2023, 9, 10, 5, "Vacation", "Approved"),
  
  // 2022 Leave Records
  generateLeaveRequest("leave074", "emp001", 2022, 6, 15, 10, "Vacation", "Approved"),
  generateLeaveRequest("leave075", "emp002", 2022, 7, 1, 7, "Vacation", "Approved"),
  generateLeaveRequest("leave076", "emp003", 2022, 8, 10, 5, "Personal", "Approved"),
  generateLeaveRequest("leave077", "emp004", 2022, 11, 20, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave078", "emp005", 2022, 11, 24, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave079", "emp006", 2022, 2, 10, 2, "Sick Leave", "Approved"),
  generateLeaveRequest("leave080", "emp007", 2022, 4, 15, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave081", "emp008", 2022, 5, 20, 6, "Vacation", "Approved"),
  generateLeaveRequest("leave082", "emp009", 2022, 9, 5, 3, "Personal", "Approved"),
  generateLeaveRequest("leave083", "emp010", 2022, 10, 10, 5, "Vacation", "Approved"),
  
  // More diverse leave patterns
  generateLeaveRequest("leave084", "emp011", 2024, 1, 8, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave085", "emp012", 2024, 2, 12, 2, "Medical", "Approved"),
  generateLeaveRequest("leave086", "emp013", 2024, 3, 18, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave087", "emp014", 2024, 4, 22, 2, "Medical", "Approved"),
  generateLeaveRequest("leave088", "emp015", 2024, 5, 8, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave089", "emp016", 2024, 6, 10, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave090", "emp017", 2024, 6, 15, 2, "Personal", "Approved"),
  generateLeaveRequest("leave091", "emp018", 2024, 7, 5, 4, "Vacation", "Approved"),
  generateLeaveRequest("leave092", "emp019", 2024, 7, 12, 2, "Personal", "Approved"),
  generateLeaveRequest("leave093", "emp020", 2024, 8, 8, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave094", "emp021", 2024, 8, 15, 1, "Personal", "Approved"),
  generateLeaveRequest("leave095", "emp022", 2024, 9, 5, 5, "Vacation", "Approved"),
  generateLeaveRequest("leave096", "emp023", 2024, 9, 12, 2, "Personal", "Approved"),
  generateLeaveRequest("leave097", "emp024", 2024, 10, 8, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave098", "emp025", 2024, 10, 15, 1, "Sick Leave", "Approved"),
  
  // Edge cases: Employees at max balance
  generateLeaveRequest("leave099", "emp016", 2024, 1, 5, 1, "Vacation", "Approved"),
  generateLeaveRequest("leave100", "emp016", 2024, 2, 10, 2, "Personal", "Approved"),
  generateLeaveRequest("leave101", "emp016", 2024, 3, 15, 3, "Vacation", "Approved"),
  generateLeaveRequest("leave102", "emp016", 2024, 4, 20, 2, "Personal", "Approved"),
  generateLeaveRequest("leave103", "emp016", 2024, 5, 25, 1, "Vacation", "Approved"),
  
  // More pending requests for approval queue
  generateLeaveRequest("leave104", "emp011", 2025, 0, 20, 3, "Vacation", "Pending"),
  generateLeaveRequest("leave105", "emp012", 2025, 1, 5, 2, "Personal", "Pending"),
  generateLeaveRequest("leave106", "emp013", 2025, 1, 10, 4, "Vacation", "Pending"),
  generateLeaveRequest("leave107", "emp014", 2025, 1, 15, 2, "Vacation", "Pending"),
  generateLeaveRequest("leave108", "emp015", 2025, 1, 20, 5, "Vacation", "Pending"),
  
  // Additional non-annual leave
  generateLeaveRequest("leave109", "emp011", 2024, 2, 8, 2, "Bereavement", "Approved"),
  generateLeaveRequest("leave110", "emp012", 2024, 3, 12, 1, "Medical", "Approved"),
  generateLeaveRequest("leave111", "emp013", 2024, 4, 18, 3, "Sick Leave", "Approved"),
  generateLeaveRequest("leave112", "emp014", 2024, 5, 22, 2, "Medical", "Approved"),
  generateLeaveRequest("leave113", "emp015", 2024, 6, 8, 1, "Sick Leave", "Approved"),
  generateLeaveRequest("leave114", "emp016", 2024, 7, 12, 4, "Parental", "Approved"),
  generateLeaveRequest("leave115", "emp017", 2024, 8, 18, 2, "Bereavement", "Approved"),
  generateLeaveRequest("leave116", "emp018", 2024, 9, 22, 1, "Medical", "Approved"),
  generateLeaveRequest("leave117", "emp019", 2024, 10, 8, 3, "Sick Leave", "Approved"),
  generateLeaveRequest("leave118", "emp020", 2024, 11, 12, 2, "Medical", "Approved"),
  
  // More half-day leaves
  generateLeaveRequest("leave119", "emp016", 2024, 2, 15, 1, "Personal", "Approved", "Half Day AM"),
  generateLeaveRequest("leave120", "emp017", 2024, 3, 20, 1, "Medical", "Approved", "Half Day PM"),
  generateLeaveRequest("leave121", "emp018", 2024, 4, 25, 1, "Personal", "Approved", "Half Day AM"),
  generateLeaveRequest("leave122", "emp019", 2024, 5, 30, 1, "Sick Leave", "Approved", "Half Day PM"),
];
