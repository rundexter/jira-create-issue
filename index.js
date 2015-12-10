var JiraApi = require('jira').JiraApi,
    querystring = require('querystring'),
    _ = require('lodash');

module.exports = {

    /**
     * Return auth object.
     *
     *
     * @param dexter
     * @returns {*}
     */
    authParams: function (dexter) {
        var auth = {
            protocol: dexter.environment('jira_protocol', 'https'),
            host: dexter.environment('jira_host'),
            port: dexter.environment('jira_port', 443),
            user: dexter.environment('jira_user'),
            password: dexter.environment('jira_password'),
            apiVers: dexter.environment('jira_apiVers', '2')
        };

        if (!dexter.environment('jira_host') || !dexter.environment('jira_user') || !dexter.environment('jira_password')) {

            this.fail('A [jira_protocol, jira_port, jira_apiVers, *jira_host, *jira_user, *jira_password] environment has this module (* - required).');

            return false;
        } else {

            return auth;
        }
    },

    issueObj: function (step) {
        var data = {};

        if (step.input('projectId').first())
            _.set(data, 'project.id', step.input('projectId').first());

        if (step.input('summary').first())
            _.set(data, 'summary', step.input('summary').first());

        if (step.input('issueTypeId').first())
            _.set(data, 'issuetype.id', step.input('issueTypeId').first());

        if (step.input('assigneeName').first())
            _.set(data, 'assignee.name', step.input('assigneeName').first());

        if (step.input('reporterName').first())
            _.set(data, 'reporter.name', step.input('reporterName').first());

        if (step.input('description').first())
            _.set(data, 'description', step.input('description').first());

        if (step.input('priorityId').first())
            _.set(data, 'priority.id', step.input('priorityId').first());

        if (step.input('labels').first())
            _.set(data, 'labels', step.input('labels').first());


        return data;
    },

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {

        var issue = this.issueObj(step);
        var auth = this.authParams(dexter);

        var jira = new JiraApi(auth.protocol, auth.host, auth.port, auth.user, auth.password, auth.apiVers);

        jira.addNewIssue({
            "fields": issue
        }, function (error, issue) {
            console.log(error, issue);

            if (error)
                this.fail(error);
            else
                this.complete(issue);
        }.bind(this));
    }
};
