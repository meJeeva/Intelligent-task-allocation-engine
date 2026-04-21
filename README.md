# Intelligent Task Allocation Engine

A comprehensive React frontend application for intelligent task allocation in software teams. This system uses machine learning and rule-based algorithms to optimally assign tasks to team members based on skills, performance, and workload.

## Features

### Core Functionality
- **Team Management**: Full CRUD operations for team members with skills, performance metrics, and workload tracking
- **Task Management**: Complete task lifecycle management with difficulty levels, deadlines, and skill requirements
- **Intelligent Allocation**: ML-powered algorithm that considers skills, performance, and workload balance
- **Real-time Analytics**: Dynamic dashboards with comprehensive statistics and insights

### Technical Features
- **Modern UI**: Clean, responsive design using Tailwind CSS
- **Toast Notifications**: User-friendly feedback system
- **Form Validation**: Comprehensive client-side validation
- **Loading States**: Professional loading indicators throughout
- **Error Handling**: Robust error handling with fallback to mock data
- **API Integration**: Full REST API integration with mock data fallback

## Tech Stack

- **React 19.2.5** with Vite for fast development
- **Tailwind CSS** for modern, responsive styling
- **React Router DOM** for client-side routing
- **Axios** for HTTP client with interceptors
- **Custom Hooks** for reusable logic

## Project Structure

```
src/
components/
  common/           # Reusable UI components
    - Button.jsx
    - Modal.jsx
    - Loader.jsx
    - Card.jsx
    - Input.jsx
    - Select.jsx
    - Badge.jsx
    - Toast.jsx
    - ToastContainer.jsx
  layout/           # Layout components
    - Sidebar.jsx
    - Navbar.jsx
    - MainLayout.jsx
  team/             # Team management components
    - TeamTable.jsx
    - TeamForm.jsx
  tasks/            # Task management components
    - TaskTable.jsx
    - TaskForm.jsx
  allocation/       # Allocation components
    - AllocationTable.jsx
pages/              # Page components
  - Dashboard.jsx
  - TeamManagement.jsx
  - TaskManagement.jsx
  - AllocationResults.jsx
services/           # API layer
  - api.js
hooks/              # Custom hooks
  - useFetch.js
utils/              # Utility functions
  - helpers.js
routes/             # Route configuration
  - AppRoutes.jsx
```

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd intelligent-task-allocation-engine
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## API Integration

The application is designed to work with a backend API at `http://localhost:5000`. The API endpoints include:

### Team Management
- `GET /api/team` - Get all team members
- `POST /api/team` - Add new team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

### Task Management
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Allocation
- `POST /allocate` - Run intelligent allocation algorithm
- `GET /api/allocation/results` - Get allocation results

### Mock Data
The application includes comprehensive mock data and will automatically fall back to it if the backend API is not available. This makes it perfect for development and demonstration purposes.

## Data Models

### Team Member
```javascript
{
  id: number,
  name: string,
  email: string,
  skills: string[],
  skillLevel: 'Junior' | 'Mid' | 'Senior',
  workload: number, // 0-100
  capacity: number, // 0-100
  performanceScore: number // 0-100
}
```

### Task
```javascript
{
  id: number,
  title: string,
  requiredSkills: string[],
  difficulty: 'Low' | 'Medium' | 'High',
  deadline: string, // ISO date
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed'
}
```

### Allocation Result
```javascript
{
  taskTitle: string,
  taskDifficulty: string,
  assigneeName: string,
  assigneeEmail: string,
  suitabilityScore: number, // 0-100
  matchedSkills: string[],
  missingSkills: string[],
  updatedWorkload: number, // 0-100
  workloadChange: string // e.g., "+15%"
}
```

## Key Features Explained

### Intelligent Allocation Algorithm
The allocation system uses a sophisticated scoring algorithm that considers:
- **Skill Matching**: Accuracy of required vs. available skills
- **Performance History**: Team member's historical performance
- **Workload Balance**: Current and projected workload after assignment
- **Task Difficulty**: Alignment with team member's skill level
- **Priority Weighting**: High-priority tasks get preferential treatment

### Visual Indicators
- **Workload Status**: Color-coded indicators (Green: Available, Yellow: High Load, Red: Overloaded)
- **Suitability Scores**: Visual representation with tooltips explaining the calculation
- **Skill Gaps**: Clear indication of missing skills for each assignment
- **Performance Metrics**: Visual badges for performance levels

## Development Features

### Responsive Design
- Mobile-friendly layout
- Adaptive grid systems
- Touch-friendly interactions

### Accessibility
- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast color schemes

### Performance
- Optimized re-renders with React hooks
- Efficient data fetching with custom hooks
- Lazy loading capabilities
- Minimal bundle size

## Academic Quality

This project is designed to meet academic standards with:
- **Clean Architecture**: Separation of concerns and modular design
- **Code Quality**: Consistent naming, comments, and documentation
- **Best Practices**: Modern React patterns and conventions
- **Error Handling**: Comprehensive error management
- **Testing Ready**: Structure designed for easy test implementation

## Future Enhancements

- Real-time updates with WebSockets
- Advanced analytics and reporting
- Export functionality (PDF, CSV)
- Team collaboration features
- Historical allocation tracking
- Machine learning model training interface
- Multi-team support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for academic demonstration purposes. Please refer to your institution's guidelines for usage and attribution.

## Support

For questions or support, please refer to the project documentation or contact the development team.
