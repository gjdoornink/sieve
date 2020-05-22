/*
 * The contents of this file are licensed. You may obtain a copy of
 * the license at https://github.com/thsmi/sieve/ or request it via
 * email from the author.
 *
 * Do not remove or change this comment.
 *
 * The initial author of the code is:
 *   Thomas Schmid <schmid-thomas@gmx.net>
 *
 */

(function () {

  "use strict";

  /* global SieveGrammar */

  if (!SieveGrammar)
    throw new Error("Could not register Notify");

  // Usage: "pipe" [":try"] <program-name: string> [<arguments: string-list>]
  // Usage: "pipe" [":copy"] [":try"] <program-name: string> [<arguments: string-list>]

  SieveGrammar.addTag({
    node: "action/pipe/try",
    type: "action/pipe/",

    token: ":try"
  });

  SieveGrammar.addAction({
    node: "action/pipe",
    type: "action",

    requires: "vnd.dovecot.pipe",

    token: "pipe",

    properties: [{
      id: "tags",
      optional: true,

      elements: [{
        id: "copy",
        type: "action/fileinto/copy"
      }, {
        id: "input",
        type: "action/pipe/try"
      }]
    }, {
      id: "program",

      elements: [{
        id: "name",
        type: "string",
        value: '""'
      }]
    }, {
      id: "arguments",
      optional: true,

      elements: [{
        id: "names",
        type: "stringlist",
        value: '""'
      }]
    }]
  });

  const filterProperties = [{
    id: "program",

    elements: [{
      id: "name",
      type: "string",
      value: '""'
    }]
  }, {
    id: "arguments",
    optional: true,

    elements: [{
      id: "names",
      type: "stringlist",
      value: '""'
    }]
  }];

  // Usage: "filter" <program-name: string> [<arguments: string-list>]
  SieveGrammar.addAction({
    node: "action/filter",
    type: "action",

    requires: "vnd.dovecot.filter",

    token: "filter",

    properties: filterProperties
  });

  SieveGrammar.addTest({
    node: "test/filter",
    type: "test",

    requires: "vnd.dovecot.filter",

    token: "filter",

    properties: filterProperties
  });


  // Usage: "execute"
  //  [":input" <input-data: string> / ":pipe"]
  //  [":output" <varname: string>]
  //  <program-name: string> [<arguments: string-list>]
  SieveGrammar.addTag({
    node: "execute/input/pipe",
    type: "execute/input/",

    token: ":pipe"
  });

  SieveGrammar.addTag({
    node: "execute/input/zone",
    type: "execute/input/",

    token: ":input",

    properties: [{
      id: "parameters",

      elements: [{
        id: "data",
        type: "string",

        value: '""'
      }]
    }]
  });

  SieveGrammar.addGroup({
    node: "execute/input",
    type: "execute/input",

    items: ["execute/input/"]
  });

  SieveGrammar.addTag({
    node: "execute/output",
    type: "execute/",

    token: ":output",

    properties: [{
      id: "parameters",

      elements: [{
        id: "varname",
        type: "string",

        value: '""'
      }]
    }]
  });


  const executeProperties = [{
    id: "tags",
    optional: true,

    elements: [{
      id: "input",
      type: "execute/input"
    }, {
      id: "output",
      type: "execute/output"
    }]
  }, {
    id: "program",

    elements: [{
      id: "name",
      type: "string",
      value: '""'
    }]
  }, {
    id: "arguments",
    optional: true,

    elements: [{
      id: "names",
      type: "stringlist",
      value: '""'
    }]
  }];

  SieveGrammar.addAction({
    node: "action/execute",
    type: "action",

    requires: "vnd.dovecot.execute",

    token: "execute",

    properties: executeProperties
  });

  SieveGrammar.addTest({
    node: "test/execute",
    type: "test",

    requires: "vnd.dovecot.execute",

    token: "execute",

    properties: executeProperties
  });


})(window);
