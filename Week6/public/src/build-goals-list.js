/**
 * @class GoalList
 *
 * Creates a list of goals and updates a list
 */

class GoalList {
  goals = [];

  constructor() {}

  /**
   * Build goal list parent.
   * Uses bootstrap classes with some custom overrides.
   */
  createGoalListParent = () => {
    const ul = document.createElement('ul');
    ul.id = 'goals-list';
    ul.className = 'list-group list-group-flush checked-list-box';
    return ul;
  };

  _deleteEventHandler = (goalId) => async () => {
    if (goalId) {
      const res = await deleteGoal(goalId);

      if (res !== null) {
        this.goals = this.goals.filter((goal) => goal.goal_id !== goalId);
        const goal = document.getElementById(`goal-${goalId}`);
        goal.remove();

        if (!this.goals.length) {
          const div = document.getElementById('goals');
          const loadingDiv = div.childNodes[1];
          const errDiv = this.generateErrorMsg('Create some new goals!');
          div.replaceChild(errDiv, loadingDiv);
        }
      }
    }
  };

  /**
   * Builds the list item.
   * Uses bootstrap classes with some custom overrides.
   *
   * {@link https://getbootstrap.com/docs/4.4/components/list-group/}
   * @example
   * <li class="list-group-item">
   *   <button class="btn btn-secondary" onclick="deleteGoal(e, index)">X</button>
   *   <span>Goal name</span>
   *   <span>pending</span>
   *   <span>date create</span>
   * </li>
   */
  buildGoalListRowItem = (goal) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.id = `goal-${goal.goal_id}`; // goal-1
    listGroupItem.className = 'list-group-item';

    const deleteBtn = document.createElement('button');
    const deleteBtnTxt = document.createTextNode('X');
    deleteBtn.className = 'btn btn-secondary';
    deleteBtn.addEventListener('click', this._deleteEventHandler(goal.goal_id));
    deleteBtn.appendChild(deleteBtnTxt);

    const goalNameSpan = document.createElement('span');
    const goalName = document.createTextNode(goal.goal_name);
    goalNameSpan.appendChild(goalName);

    const goalStatusSpan = document.createElement('span');
    const goalStatus = document.createTextNode(goal.status);
    goalStatusSpan.append(goalStatus);

    const goalDateSpan = document.createElement('span');
    const goalDate = document.createTextNode(goal.created_date);
    goalDateSpan.append(goalDate);

    // add list item's details
    listGroupItem.append(deleteBtn);
    listGroupItem.append(goalNameSpan);
    listGroupItem.append(goalStatusSpan);
    listGroupItem.append(goalDateSpan);

    return listGroupItem;
  };

  /**
   * Assembles the list items then mounts them to a parent node.
   * Uses bootstrap classes with some custom overrides.
   */
  buildGoalsList = (mount, goals) =>
    goals.map((goal) => {
      const listGroupRowItem = this.buildGoalListRowItem(goal);

      // add entire list item
      mount.append(listGroupRowItem);
    });

  generateErrorMsg = (msg) => {
    const div = document.createElement('div');
    const text = document.createTextNode(msg);
    div.id = 'user-message';
    div.className = 'center';
    div.appendChild(text);
    return div;
  };

  generateGoals = async () => {
    const res = await getGoals();
    const div = document.getElementById('goals');
    const loadingDiv = div.childNodes[1];

    if (res.length) {
      this.goals = res;
      const goalsDiv = this.createGoalListParent();
      this.buildGoalsList(goalsDiv, res);
      div.replaceChild(goalsDiv, loadingDiv);
    } else {
      const errDiv = this.generateErrorMsg(res.msg);
      div.replaceChild(errDiv, loadingDiv);
    }
  };
}

const inst = new GoalList();

// This is an IIFE (Immediately Invoked Function Expression).
(async () => {
  inst.generateGoals();
})();
