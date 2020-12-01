/**
 * AJAX add new goals to goal list on save.
 */
const doAddGoal = async (e) => {
  e.preventDefault();

  const goalInput = document.getElementById('formInputGoalName');
  const goal_name = goalInput.value;
  const statusSelect = document.getElementById('formSelectStatus');
  const options = statusSelect.options;
  const selectedIndex = statusSelect.selectedIndex;
  const status = options[selectedIndex].text;

  if (!goal_name) {
    alert('Please enter a goal name.');
    return;
  }

  const res = await addGoal({ goal_name, status });

  if (res !== null) {
    inst.generateGoals();
  }
  goalInput.value = '';
};
