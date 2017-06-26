function postMessage(slackToken, slackChannel) {
  // save.gsで保存した定数を取得
  var prop    = PropertiesService.getScriptProperties().getProperties();
  var issues  = []
  prop.repositrys.split(',').forEach(function(repo) {
    Array.prototype.push.apply(issues, findIssues(repo));
  })

  var message = createMessage(issues);

  if (message) {
    // slackApp インスタンスの取得
    var slackApp     = SlackApp.create(prop.slackToken);
    var now          = new Date();
    var yesterday    = now.getFullYear() + '/' + (now.getMonth() + 1)+ '/' + (now.getDate() - 1);
    var messageTitle = yesterday+ 'に登録されたissue一覧\n\n';

    slackApp.postMessage(prop.slackChannel, messageTitle + message, {username: "Life Media bot", icon_emoji: ":airplane_arriving:"});
  }

  // 以下関数
  function findIssues(repo) {
    //取得したいisuueページ数。更新頻度が少なそうなのでとりあえず1
    var page_count = 1;

    var base = 'https://api.github.com/repos/' + prop.githubOwner + '/' + repo + '/issues';
    var url  = base + '?page=' + page_count + '&state=all&sort=created&direction=desc&access_token=' + prop.githubToken;

    var response = UrlFetchApp.fetch(url);
    var json     = response.getContentText();
    var data     = [];
    Array.prototype.push.apply(data,JSON.parse(json));

    // プルリクエストのデータを排除
    data = data.filter(function(issue, index, array) {
      return issue.html_url.match(/issue/g);
    });

    return data;
  }

  function createMessage(issues) {
    var yesterdayIssues = issues.filter(function(issue) {
      var now        = new Date();
      var yesterday  = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      var created_at = convertDate(issue["created_at"]);

      // dateのオブジェクトで比較
      if (created_at > yesterday) {
        return issue;
      }
    });

    if (yesterdayIssues.length > 0) {
      return modifyMessage(yesterdayIssues);
    }
    return '';
  }
  
  function convertDate(date) {
      date = date.replace( /-/g , "/" );
      date = date.replace( /T/g , " " );
      date = date.replace( /Z/g , " " );
      return new Date(date);  
  }
  
  function modifyMessage(issues) {
    var issueLines = issues.map(function(issue) {
      return "・" + issue["title"] + "(" + issue["user"]["login"] + ")" + " " + issue["html_url"];
    });

    var message = issueLines.reduce(function(prev, current, index, array) {
      return prev + "\n" + current;
    })
    return message;
  }
}
