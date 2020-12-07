/**
 * @class Goal
 *
 * Creates a list of goals and updates a list
 */

class Goal {
  goals = [];
  goalsService;

  constructor(goalsService) {
    this.goalsService = goalsService;
  }

  init() {
    this.render();
  }

  /**
   * DOM renderer for building the list row item.
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
  _renderListRowItem = (goal) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.id = `goal-${goal.goal_id}`;
    listGroupItem.className = 'list-group-item';

    const deleteBtn = document.createElement('button');
    const deleteBtnTxt = document.createTextNode('X');
    deleteBtn.id = 'delete-btn';
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
   * DOM renderer for assembling the list items then mounting them to a parent node.
   */
  _renderList = () => {
    // get the "Loading..." text node from parent element
    const goalsDiv = document.getElementById('goals');
    const loadingDiv = goalsDiv.childNodes[0];
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.id = 'goals-list';
    ul.className = 'list-group list-group-flush checked-list-box';

    this.goals.map((goal) => {
      const listGroupRowItem = this._renderListRowItem(goal);

      // add entire list item
      ul.appendChild(listGroupRowItem);
    });

    fragment.appendChild(ul);
    goalsDiv.replaceChild(fragment, loadingDiv);
  };

  /**
   * DOM renderer for displaying a default message when a user has an empty list.
   */
  _renderMsg = () => {
    const goalsDiv = document.getElementById('goals');
    const loadingDiv = goalsDiv.childNodes[0];
    const listParent = document.getElementById('goals-list');
    const msgDiv = this._createMsgElement('Create some new goals!');

    if (goalsDiv) {
      goalsDiv.replaceChild(msgDiv, loadingDiv);
    } else {
      goalsDiv.replaceChild(msgDiv, listParent);
    }
  };

  /**
   * Pure function for adding a goal.
   *
   * @param {Object} newGoal - form's values as an object
   */
  addGoal = async (newGoal) => {
    try {
      const { goal_name, status } = newGoal;
      await this.goalsService.addGoal({ goal_name, status }); // we just want the name and status
      this.goals.push(newGoal); // push goal with all it parts
    } catch (err) {
      console.log(err);
      alert('Unable to add goal. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for adding a goal to the DOM.
   *
   * @param {number} goalId - id of the goal to delete
   */
  _addGoalEventHandler = () => {
    const goalInput = document.getElementById('formInputGoalName');
    const goal_name = goalInput.value;

    const statusSelect = document.getElementById('formSelectStatus');
    const options = statusSelect.options;
    const selectedIndex = statusSelect.selectedIndex;
    const status = options[selectedIndex].text;

    // validation checks
    if (!goal_name) {
      alert('Please enter a goal name.');
      return;
    }

    const goal = { goal_name, status }; // assemble the new goal parts
    const { newGoal, newGoalEl } = this._createNewGoalEl(goal); // add goal to list

    this.addGoal(newGoal);

    const listParent = document.getElementById('goals-list');

    if (listParent) {
      listParent.appendChild(newGoalEl);
    } else {
      this._renderList();
    }
    goalInput.value = ''; // clear form text input
  };

  /**
   * Create the DOM element for the new goal with all its parts.
   *
   * @param {Object} goal - { goal_name, status } partial status object
   */
  _createNewGoalEl = (goal) => {
    const goal_id = this.goals.length;
    const created_date = new Date().toISOString();
    const newGoal = { ...goal, goal_id, created_date };
    const newGoalEl = this._renderListRowItem(newGoal);

    return { newGoal, newGoalEl };
  };

  /**
   * Pure function for deleting a goal.
   *
   * @param {number} goalId - id for the goal to be deleted
   */
  deleteGoal = async (goalId) => {
    try {
      const res = await this.goalsService.deleteGoal(goalId);
      this.goals = this.goals.filter((goal) => goal.goal_id !== goalId);

      if (res !== null) {
        alert('Goal deleted successfully!');
      }
      return res;
    } catch (err) {
      alert('Unable to delete goal. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for deleting a goal from the DOM.
   * This relies on a pre-existing in the list of goals.
   *
   * @param {number} goalId - id of the goal to delete
   */
  _deleteEventHandler = (goalId) => () => {
    const goal = document.getElementById(`goal-${goalId}`);
    goal.remove();

    this.deleteGoal(goalId).then(() => {
      if (!this.goals.length) {
        this._renderMsg();
      }
    });
  };

  /**
   * Creates a message div block.
   *
   * @param {string} msg - custom message to display
   */
  _createMsgElement = (msg) => {
    const msgDiv = document.createElement('div');
    const text = document.createTextNode(msg);
    msgDiv.id = 'user-message';
    msgDiv.className = 'center';
    msgDiv.appendChild(text);

    return msgDiv;
  };

  render = async () => {
    const goals = await this.goalsService.getGoals();

    try {
      if (goals.length) {
        this.goals = goals;
        this._renderList();
      } else {
        this._renderMsg();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
}
