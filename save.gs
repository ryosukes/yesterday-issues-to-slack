function saveConfig() {
  PropertiesService.getScriptProperties().setProperty("slackToken",   "hoge");
  PropertiesService.getScriptProperties().setProperty("slackChannel", "#hoge");
  PropertiesService.getScriptProperties().setProperty("githubToken",  "hoge");
  PropertiesService.getScriptProperties().setProperty("githubOwner",  "hoge");
  PropertiesService.getScriptProperties().setProperty("repositrys",   "hoge,fuga,piyo");
}

