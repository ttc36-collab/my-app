import React from "react";

// Define Issue type
type Issue = {
  id: number;
  status: string;
  owner: string;
  created: Date;
  effort: number;
  completionDate?: Date;
  title: string;
  priority: string;
};

// --------------------
// Helper Function
// --------------------
function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const borderedStyle: React.CSSProperties = {
  border: "1px solid silver",
  padding: 6,
};

// --------------------
// IssueRow
// --------------------
class IssueRow extends React.Component<{
  issue: Issue;
  deleteIssue: (id: number) => void;
}> {
  render() {
    const { issue } = this.props;
    return (
      <tr>
        <td style={borderedStyle}>{issue.id}</td>
        <td style={borderedStyle}>{issue.status}</td>
        <td style={borderedStyle}>{issue.owner}</td>
        <td style={borderedStyle}>{formatDate(issue.created)}</td>
        <td style={borderedStyle}>{issue.effort}</td>
        <td style={borderedStyle}>
          {issue.completionDate ? formatDate(issue.completionDate) : ""}
        </td>
        <td style={borderedStyle}>{issue.title}</td>
        <td style={borderedStyle}>{issue.priority}</td>
        <td style={borderedStyle}>
          <button onClick={() => this.props.deleteIssue(issue.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

// --------------------
// IssueTable
// --------------------
class IssueTable extends React.Component<{
  issues: Issue[];
  deleteIssue: (id: number) => void;
}> {
  render() {
    const issueRows = this.props.issues.map((issue) => (
      <IssueRow
        key={issue.id}
        issue={issue}
        deleteIssue={this.props.deleteIssue}
      />
    ));
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={borderedStyle}>Id</th>
            <th style={borderedStyle}>Status</th>
            <th style={borderedStyle}>Owner</th>
            <th style={borderedStyle}>Created</th>
            <th style={borderedStyle}>Effort</th>
            <th style={borderedStyle}>Completion Date</th>
            <th style={borderedStyle}>Title</th>
            <th style={borderedStyle}>Priority</th>
            <th style={borderedStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>{issueRows}</tbody>
      </table>
    );
  }
}

// --------------------
// IssueFilter
// --------------------
class IssueFilter extends React.Component {
  render() {
    return <div></div>;
  }
}

// --------------------
// IssueAdd
// --------------------
type IssueAddProps = {
  addIssue: (issue: Issue) => void;
};

type IssueAddState = {
  owner: string;
  title: string;
  effort: string;
  completionDate: string;
  priority: string;
};

class IssueAdd extends React.Component<IssueAddProps, IssueAddState> {
  constructor(props: IssueAddProps) {
    super(props);
    this.state = {
      owner: "",
      title: "",
      effort: "",
      completionDate: "",
      priority: "Low",
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState({ [name]: value } as Pick<IssueAddState, keyof IssueAddState>);
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssue: Issue = {
      id: 0,
      status: "Open",
      owner: this.state.owner,
      created: new Date(),
      effort: Number(this.state.effort),
      completionDate: this.state.completionDate
        ? new Date(this.state.completionDate)
        : undefined,
      title: this.state.title,
      priority: this.state.priority,
    };
    this.props.addIssue(newIssue);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input name="owner" placeholder="Owner" onChange={this.handleChange} />
        <input name="title" placeholder="Title" onChange={this.handleChange} />
        <input name="effort" placeholder="Effort" onChange={this.handleChange} />
        <input name="completionDate" type="date" onChange={this.handleChange} />
        <button type="submit">Add Issue</button>
      </form>
    );
}
}

// IssueList
type IssueListState = {
  issues: Issue[];
};

class IssueList extends React.Component<{}, IssueListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      issues: [
        {
          id: 1,
          status: "Open",
          owner: "John",
          created: new Date("2016-08-15"),
          effort: 5,
          completionDate: undefined,
          title: "Error in console when clicking Add",
          priority: "High",
        },
        {
          id: 2,
          status: "Assigned",
          owner: "Emma",
          created: new Date("2016-08-16"),
          effort: 14,
          completionDate: new Date("2016-08-30"),
          title: "Missing bottom border on panel",
          priority: "Low",
        },
      ],
    };
  }

  addIssue = (issue: Issue) => {
    const newId = Math.max(...this.state.issues.map(i => i.id)) + 1;
    const updatedIssue = { ...issue, id: newId };
    this.setState((prevState) => ({
      issues: [...prevState.issues, updatedIssue]
    }));
    console.log("addIssue called - state snapshot (OLD):", this.state.issues);
  };

  deleteIssue = (id: number) => {
    this.setState((prevState) => ({
      issues: prevState.issues.filter((issue) => issue.id !== id)
    }));
    console.log("deleteIssue called - state snapshot (OLD):", this.state.issues);
  };

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker</h1>
        <IssueFilter />
        <hr />
        <p>Total Issues: {this.state.issues.length}</p>
        <IssueTable
          issues={this.state.issues}
          deleteIssue={this.deleteIssue}
        />
        <hr />
        <IssueAdd addIssue={this.addIssue} />
      </React.Fragment>
    );
  }
}

export default IssueList;