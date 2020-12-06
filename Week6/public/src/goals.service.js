const GOALS_API = `${BASE_API_URL}/goals`; // http://localhost:3000/api/goals

const getGoals = () => _get(GOALS_API, OPTIONS_WITH_AUTH);

const addGoal = (formData) =>
  _post(GOALS_API, formData, DEFAULT_OPTIONS_WITH_AUTH);

const deleteGoal = (goalId) =>
  _delete(`${GOALS_API}/${goalId}`, OPTIONS_WITH_AUTH);
