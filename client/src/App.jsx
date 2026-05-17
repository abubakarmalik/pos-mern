import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchCurrentUser } from './features/auth/authSlice';
import { selectToken } from './features/auth/authSelector';

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token]);

  return <AppRoutes />;
}

export default App;







// You are a senior frontend developer.

// Your task is to review the full client-side codebase and improve the UI/UX across the app. The current UI is very basic and needs to look modern, clean, consistent, and professional.

// Requirements:

// 1. Read and understand all client-side code before making changes.
// 2. The project UI is built with Tailwind CSS.
// 3. Do not use any external UI library or component library. Use only Tailwind CSS.
// 4. Improve overall layout, spacing, typography, responsiveness, visual hierarchy, cards, buttons, forms, tables, navigation, and empty states.
// 5. Add skeleton loading states wherever data is being fetched or the page currently feels blank/loading.
// 6. Add confirmation modals where needed, especially for:
//    - Logout
//    - Delete actions
//    - Status updates
//    - Any important or irreversible action
// 7. Improve user experience with better hover states, transitions, disabled states, validation states, and clear success/error feedback.
// 8. Create a global design/theme file for:
//    - Colors
//    - Spacing
//    - Border radius
//    - Font sizes
//    - Shadows
//    - Common layout sizes

// The goal is that if I want to change the color palette or key sizing later, I only update this global file, and the changes apply across the whole app.

// Important:
// - Keep the existing business logic and API integration unchanged.
// - Do not break existing routes, components, or functionality.
// - Refactor repeated UI patterns into reusable components where appropriate.
// - Make the design responsive for desktop, tablet, and mobile.
// - Use clean, readable, production-level code.
// - After changes, ensure the app builds successfully and there are no lint/type errors.
