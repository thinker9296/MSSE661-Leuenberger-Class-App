const TASKS_API = `${BASE_API_URL}/goals`; // http://localhost:3000/api/goals

const getGoals = () => _get(TASKS_API, OPTIONS_WITH_AUTH);

const addGoal = (formData) =>
  _post(TASKS_API, formData, DEFAULT_OPTIONS_WITH_AUTH);

const deleteGoal = (goalId) =>
  _delete(`${TASKS_API}/${goalId}`, OPTIONS_WITH_AUTH);
