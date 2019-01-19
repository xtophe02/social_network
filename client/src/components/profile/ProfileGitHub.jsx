import React, { Component } from "react";
import PropTypes from "prop-types";

class ProfileGitHub extends Component {
  state = {
    clientId: "096d61e0c9ddeb595629",
    clientSecret: "0d5c849825a4d7fa4323fdf00594f0acfe430b26",
    count: "5",
    sort: "created: asc",
    repos: []
  };
  _isMounted = false;
  componentDidMount = () => {
    this._isMounted = true;
    const { username } = this.props;
    const { count, sort, clientId, clientSecret } = this.state;

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`
    )
      .then(res => res.json())
      .then(data => {
        if (this._isMounted) {
          this.setState({ repos: data });
        }
      })
      .catch(err => console.log(err));
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    const { repos } = this.state;

    const repoItems = repos.map(repo => (
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a
                href={repo.html_url}
                className="text-info"
                target="_blank"
                rel="noopener noreferrer"
              >
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secodanry mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div>
        <hr />
        <h3 className="mb-4">Latest Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGitHub.propTypes = {
  username: PropTypes.string.isRequired
};

export default ProfileGitHub;
