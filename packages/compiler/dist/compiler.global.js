var compiler = (function (exports) {
  'use strict';

  var TokenReader = /** @class */ (function () {
      function TokenReader(tokens) {
          this.tokens = [];
          this.pos = 0;
          this.tokens = tokens;
      }
      TokenReader.prototype.loadTokens = function (tokens) {
          this.tokens = tokens;
          this.pos = 0;
      };
      TokenReader.prototype.read = function () {
          if (this.pos < this.tokens.length) {
              return this.tokens[this.pos++];
          }
          return null;
      };
      TokenReader.prototype.peek = function () {
          if (this.pos < this.tokens.length) {
              return this.tokens[this.pos];
          }
          return null;
      };
      TokenReader.prototype.unread = function () {
          if (this.pos > 0) {
              this.pos -= 1;
          }
      };
      return TokenReader;
  }());

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __decorate(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
      else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
  }

  function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
  }

  var JSXTokenizer;
  (function (JSXTokenizer) {
      JSXTokenizer.TagStartType = Symbol("TagStartType");
      JSXTokenizer.JSXIdentifierType = Symbol("JSXIdentifier");
      JSXTokenizer.JSXAttributeKey = Symbol("JSXAttributeKey");
      JSXTokenizer.Equator = Symbol("Equator");
      JSXTokenizer.JSXAttributeValue = Symbol("JSXAttributeValue");
      JSXTokenizer.TagEndType = Symbol("TagEndType");
      JSXTokenizer.BackFlash = Symbol("BackFlash");
      JSXTokenizer.Text = Symbol("Text");
      JSXTokenizer.Comment = Symbol("Comment");
  })(JSXTokenizer || (JSXTokenizer = {}));
  var Tokenizer = /** @class */ (function () {
      function Tokenizer() {
          this.tokens = [];
          this.currentToken = {
              type: Symbol("INIT"),
              value: "",
          };
          this.RE = {
              LETTERS: /[a-zA-Z0-9\-]/,
              ATTRIBUTEKEY: /[a-zA-Z0-9-@:$\.]/,
              ATTRIBUTEVALUE: /[^\"\'\`]/,
              Text: /[^>]/,
              commentContent: /[^-]/,
              Quote: /['"`]/,
          };
      }
      Tokenizer.prototype.run = function (input) {
          this.tokens = [];
          var state = this.searchBeginTagStart;
          for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
              var char = input_1[_i];
              if (state !== undefined) {
                  // 忽略换行
                  if (/\r\n|\r|\n/.test(char))
                      continue;
                  state = state && state.call(this, char);
              }
          }
          console.log("Tokens Generate Success!");
          return this.tokens;
      };
      Tokenizer.prototype.searchBeginTagStart = function (char) {
          if (char === "<") {
              this.emit(this.currentToken);
              this.emit({
                  type: JSXTokenizer.TagStartType,
                  value: char,
              });
              this.resetCurrentToken();
              return this.searchJSXIdentifier;
          }
          if (this.RE.Quote.test(char)) {
              this.currentToken.type = JSXTokenizer.Text;
              this.currentToken.value += "\\" + char;
              return this.searchBeginTagStart;
          }
          if (this.RE.Text.test(char)) {
              this.currentToken.type = JSXTokenizer.Text;
              this.currentToken.value += char;
              return this.searchBeginTagStart;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.searchJSXIdentifier = function (char) {
          if (this.RE.LETTERS.test(char)) {
              this.currentToken.type = JSXTokenizer.JSXIdentifierType;
              this.currentToken.value += char;
              return this.searchJSXIdentifier;
          }
          if (char === " ") {
              this.emit(this.currentToken);
              this.resetCurrentToken();
              return this.searchJSXAttributeKey;
          }
          if (char === "/") {
              this.emit({
                  type: JSXTokenizer.BackFlash,
                  value: char,
              });
              return this.searchJSXIdentifier;
          }
          if (char === ">") {
              this.emit(this.currentToken);
              this.resetCurrentToken();
              this.emit({
                  type: JSXTokenizer.TagEndType,
                  value: char,
              });
              return this.searchBeginTagStart;
          }
          if (char === "!") {
              var lastToken = this.pop();
              if (lastToken !== undefined &&
                  lastToken.type !== JSXTokenizer.TagStartType) {
                  throw TypeError("UnExcepted char " + char);
              }
              this.currentToken = {
                  type: JSXTokenizer.Comment,
                  value: "<!",
              };
              return this.searchFirstCommentBar;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.searchFirstCommentBar = function (char) {
          if (char === "-") {
              this.currentToken.value += char;
              return this.searchSecondCommentBar;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.searchSecondCommentBar = function (char) {
          if (char === "-") {
              this.currentToken.value += char;
              return this.searchCommentContent;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.searchCommentContent = function (char) {
          if (this.RE.commentContent.test(char)) {
              this.currentToken.value += char;
              return this.searchCommentContent;
          }
          else if (char === "-") {
              this.currentToken.value += char;
              return this.searchCommentEnd;
          }
          throw TypeError("Unexpeted Error");
      };
      Tokenizer.prototype.searchCommentEnd = function (char) {
          if (char === "-") {
              this.currentToken.value += char;
              return this.searchCommentEnd;
          }
          else if (char === ">") {
              this.currentToken.value += char;
              this.emit(this.currentToken);
              this.resetCurrentToken();
              return this.searchBeginTagStart;
          }
          else {
              this.currentToken.value += char;
              return this.searchCommentContent;
          }
      };
      Tokenizer.prototype.searchJSXAttributeKey = function (char) {
          if (char === " ") {
              this.emit(this.currentToken);
              this.resetCurrentToken();
              return this.searchJSXAttributeKey;
          }
          if (this.RE.ATTRIBUTEKEY.test(char)) {
              this.currentToken.type = JSXTokenizer.JSXAttributeKey;
              this.currentToken.value += char;
              return this.searchJSXAttributeKey;
          }
          if (char === "=") {
              this.emit(this.currentToken);
              this.resetCurrentToken();
              this.emit({
                  type: JSXTokenizer.Equator,
                  value: char,
              });
              return this.searchJSXAttributeValue;
          }
          if (char === ">") {
              this.emit(this.currentToken);
              this.resetCurrentToken();
              this.emit({
                  type: JSXTokenizer.TagEndType,
                  value: char,
              });
              return this.foundJSXBeginTagEnd;
          }
          if (char === "/") {
              this.emit({
                  type: JSXTokenizer.BackFlash,
                  value: char,
              });
              return this.foundBackFlashInAttribute;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.foundBackFlashInAttribute = function (char) {
          if (char === ">") {
              this.emit({
                  type: JSXTokenizer.TagEndType,
                  value: char,
              });
              return this.foundJSXBeginTagEnd;
          }
          throw TypeError("Should Be > after /");
      };
      Tokenizer.prototype.searchJSXAttributeValue = function (char) {
          if (this.RE.Quote.test(char)) {
              this.currentQuote = char;
              this.currentToken.type = JSXTokenizer.JSXAttributeValue;
              this.currentToken.value = "";
              return this.foundAttributeQuote;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.foundAttributeQuote = function (char) {
          if (this.RE.ATTRIBUTEVALUE.test(char)) {
              this.currentToken.type = JSXTokenizer.JSXAttributeValue;
              this.currentToken.value += char;
              return this.foundAttributeQuote;
          }
          if (char === this.currentQuote) {
              this.currentToken.type = JSXTokenizer.JSXAttributeValue;
              // this.currentToken.value += char;
              this.emit(this.currentToken, true);
              this.resetCurrentToken();
              return this.searchJSXAttributeKey;
          }
          if (this.RE.Quote.test(char)) {
              this.currentToken.value += "\\" + char;
              return this.foundAttributeQuote;
          }
          throw TypeError("UnExcepted Error");
      };
      Tokenizer.prototype.foundJSXBeginTagEnd = function (char) {
          if (char === "<") {
              this.emit(this.currentToken);
              this.currentToken = {
                  type: JSXTokenizer.TagStartType,
                  value: char,
              };
              this.emit(this.currentToken);
              this.resetCurrentToken();
              return this.searchJSXIdentifier;
          }
          if (this.RE.Quote.test(char)) {
              this.currentToken.type = JSXTokenizer.Text;
              this.currentToken.value += "\\" + char;
              return this.foundJSXBeginTagEnd;
          }
          this.currentToken.type = JSXTokenizer.Text;
          this.currentToken.value += char;
          return this.foundJSXBeginTagEnd;
      };
      Tokenizer.prototype.resetCurrentToken = function () {
          if (this.currentToken === null)
              return;
          this.currentToken = {
              type: Symbol("INIT"),
              value: "",
          };
      };
      Tokenizer.prototype.emit = function (token, force) {
          if ((!token.value || !token.value.trim()) && !force)
              return;
          this.tokens.push(token);
      };
      Tokenizer.prototype.pop = function () {
          return this.tokens.pop();
      };
      __decorate([
          jumpSpace,
          __metadata("design:type", Function),
          __metadata("design:paramtypes", [String]),
          __metadata("design:returntype", Function)
      ], Tokenizer.prototype, "searchJSXAttributeValue", null);
      return Tokenizer;
  }());
  function jumpSpace(target, propertyKey, descriptor) {
      var method = descriptor.value;
      var jumpSpaceFunc = function (char) {
          if (char === " ")
              return jumpSpaceFunc;
          return method.call(this, char);
      };
      descriptor.value = jumpSpaceFunc;
  }
  function createTokenizer(Tokenizer) {
      return new Tokenizer();
  }

  var AST;
  (function (AST) {
      // 非终结符
      AST.ASTNodeType = {
          Program: Symbol("Program"),
          Expr: Symbol("Expr"),
          TagHead: Symbol("TagHead"),
          TagHeadStart: Symbol("TagHeadStart"),
          Attribute: Symbol("Attribute"),
          TagHeadEnd: Symbol("TagHeadEnd"),
          TagTail: Symbol("TagTail"),
      };
      // 终结符
      AST.FinalTokenType = {
          Text: Symbol("Text"),
          Comment: Symbol("Comment"),
          LeftBracket: Symbol("LeftBracket"),
          Identifier: Symbol("Identifier"),
          AttributeKey: Symbol("AttributeKey"),
          Equator: Symbol("Equator"),
          AttributeValue: Symbol("AttributeValue"),
          BackFlash: Symbol("BackFlash"),
          RightBracket: Symbol("RightBracket"),
      };
      var Parse = /** @class */ (function () {
          function Parse(tokens) {
              this.tokenReader = new TokenReader([]);
              this.closeSelf = false;
              this.identifierStack = [];
              this.tokenReader.loadTokens(tokens);
              this.ast = this.toAST();
          }
          Parse.prototype.createAST = function (tokens) {
              this.tokenReader.loadTokens(tokens);
              return this.toAST();
          };
          Parse.prototype.createASTNode = function (type, children, value) {
              var node = {
                  type: type,
              };
              if (children !== undefined)
                  node.children = children;
              if (value !== undefined)
                  node.value = value;
              return node;
          };
          Parse.prototype.setCurrentToken = function (token) {
              if (token !== null) {
                  this.currentToken = token;
              }
          };
          Parse.prototype.toAST = function () {
              this.Program();
              return this.ast;
          };
          Parse.prototype.checkIdentifier = function () {
              var _a, _b;
              if (this.closeSelf)
                  return;
              var lastIdentifier = this.identifierStack.pop();
              if (((_a = this.tokenReader.peek()) === null || _a === void 0 ? void 0 : _a.value) !== lastIdentifier) {
                  throw TypeError("Unexpeted TagTail Identifier " + ((_b = this.tokenReader.peek()) === null || _b === void 0 ? void 0 : _b.value) + " whitch is not match " + lastIdentifier);
              }
          };
          Parse.prototype.Program = function () {
              var root = this.createASTNode(AST.ASTNodeType.Program, []);
              this.currentNode = root;
              this.parentNode = root;
              this.ast = root;
              if (!this.tokenReader.tokens.length)
                  return false;
              if (this.Expr()) {
                  console.log("AST Generate Success!");
                  return true;
              }
              throw TypeError("AST Generate Failed!");
          };
          Parse.prototype.Expr = function () {
              var _a, _b, _c, _d, _e;
              this.setCurrentToken(this.tokenReader.peek());
              var oldParent = this.parentNode;
              var node = this.createASTNode(AST.ASTNodeType.Expr, []);
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.currentToken.type === JSXTokenizer.Comment) {
                  var textNode = this.createASTNode(AST.FinalTokenType.Comment, undefined, this.currentToken.value);
                  node.elementType = "Comment";
                  (_b = this.parentNode.children) === null || _b === void 0 ? void 0 : _b.push(textNode);
                  this.tokenReader.read();
                  this.parentNode = oldParent;
                  this.Expr();
                  return true;
              }
              else if (this.currentToken.type === JSXTokenizer.Text) {
                  var textNode = this.createASTNode(AST.FinalTokenType.Text, undefined, this.currentToken.value);
                  node.elementType = "Text";
                  (_c = this.parentNode.children) === null || _c === void 0 ? void 0 : _c.push(textNode);
                  this.tokenReader.read();
                  this.parentNode = oldParent;
                  this.Expr();
                  return true;
              }
              else if (this.TagHead()) {
                  node.elementType = "Element";
                  if (this.closeSelf) {
                      node.closeSelf = true;
                      this.parentNode = oldParent;
                      this.Expr();
                      return true;
                  }
                  node.closeSelf = false;
                  this.parentNode = node;
                  if (this.Expr()) {
                      this.parentNode = node;
                      if (this.TagTail()) {
                          this.parentNode = oldParent;
                          this.Expr();
                          return true;
                      }
                      (_d = oldParent.children) === null || _d === void 0 ? void 0 : _d.pop();
                      return false;
                  }
                  else {
                      this.parentNode = node;
                      if (this.TagTail()) {
                          this.parentNode = oldParent;
                          this.Expr();
                          return true;
                      }
                  }
              }
              (_e = oldParent.children) === null || _e === void 0 ? void 0 : _e.pop();
              return false;
          };
          Parse.prototype.TagHead = function () {
              var _a, _b, _c;
              this.closeSelf = false;
              this.setCurrentToken(this.tokenReader.peek());
              var node = this.createASTNode(AST.ASTNodeType.TagHead, []);
              var oldParent = this.parentNode;
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.TagHeadStart()) {
                  this.parentNode = node;
                  if (this.Attribute()) {
                      this.parentNode = node;
                      if (this.TagHeadEnd()) {
                          node.closeSelf = !!this.closeSelf;
                          return true;
                      }
                      (_b = oldParent.children) === null || _b === void 0 ? void 0 : _b.pop();
                      return false;
                  }
                  else {
                      this.parentNode = node;
                      if (this.TagHeadEnd()) {
                          node.closeSelf = !!this.closeSelf;
                          return true;
                      }
                  }
              }
              (_c = oldParent.children) === null || _c === void 0 ? void 0 : _c.pop();
              return false;
          };
          Parse.prototype.TagHeadStart = function () {
              var _a, _b;
              this.setCurrentToken(this.tokenReader.peek());
              var node = this.createASTNode(AST.ASTNodeType.TagHeadStart, []);
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.currentToken.value === "<") {
                  // this.parentNode.children?.push(
                  //   this.createASTNode(
                  //     FinalTokenType.LeftBracket,
                  //     undefined,
                  //     this.currentToken.value
                  //   )
                  // );
                  this.tokenReader.read();
                  this.setCurrentToken(this.tokenReader.peek());
                  if (this.currentToken.type === JSXTokenizer.JSXIdentifierType) {
                      this.identifierStack.push(this.currentToken.value);
                      (_b = this.parentNode.children) === null || _b === void 0 ? void 0 : _b.push(this.createASTNode(AST.FinalTokenType.Identifier, undefined, this.currentToken.value));
                      this.tokenReader.read();
                      return true;
                  }
                  this.tokenReader.unread();
                  return false;
              }
              return false;
          };
          Parse.prototype.Attribute = function () {
              var _a, _b, _c, _d, _e, _f, _g, _h;
              this.setCurrentToken(this.tokenReader.peek());
              var oldParent = this.parentNode;
              var node = this.createASTNode(AST.ASTNodeType.Attribute, []);
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.currentToken.type === JSXTokenizer.JSXAttributeKey) {
                  (_b = this.parentNode.children) === null || _b === void 0 ? void 0 : _b.push(this.createASTNode(AST.FinalTokenType.AttributeKey, undefined, this.currentToken.value));
                  this.tokenReader.read();
                  if (((_c = this.tokenReader.peek()) === null || _c === void 0 ? void 0 : _c.type) === JSXTokenizer.Equator) {
                      // this.parentNode.children?.push(
                      //   this.createASTNode(
                      //     FinalTokenType.Equator,
                      //     undefined,
                      //     this.tokenReader.peek()?.value
                      //   )
                      // );
                      this.tokenReader.read();
                      if (((_d = this.tokenReader.peek()) === null || _d === void 0 ? void 0 : _d.type) === JSXTokenizer.JSXAttributeValue) {
                          (_e = this.parentNode.children) === null || _e === void 0 ? void 0 : _e.push(this.createASTNode(AST.FinalTokenType.AttributeValue, undefined, (_f = this.tokenReader.peek()) === null || _f === void 0 ? void 0 : _f.value));
                          this.tokenReader.read();
                          this.parentNode = oldParent;
                          if (this.Attribute())
                              return true;
                          return true;
                      }
                      this.tokenReader.unread(); // 把 = 退掉
                      this.tokenReader.unread(); // 把 AttributeKey 退掉
                      (_g = oldParent.children) === null || _g === void 0 ? void 0 : _g.pop();
                      return false;
                  }
                  this.parentNode = oldParent;
                  this.Attribute();
                  return true;
              }
              (_h = oldParent.children) === null || _h === void 0 ? void 0 : _h.pop();
              return false;
          };
          Parse.prototype.TagHeadEnd = function () {
              var _a, _b, _c;
              this.setCurrentToken(this.tokenReader.peek());
              var node = this.createASTNode(AST.ASTNodeType.TagHeadEnd, []);
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.currentToken.type === JSXTokenizer.BackFlash) {
                  // this.parentNode.children?.push(
                  //   this.createASTNode(
                  //     FinalTokenType.BackFlash,
                  //     undefined,
                  //     this.currentToken.value
                  //   )
                  // );
                  this.tokenReader.read();
                  if (((_b = this.tokenReader.peek()) === null || _b === void 0 ? void 0 : _b.value) === ">") {
                      // this.parentNode.children?.push(
                      //   this.createASTNode(
                      //     FinalTokenType.RightBracket,
                      //     undefined,
                      //     this.tokenReader.peek()?.value
                      //   )
                      // );
                      this.tokenReader.read();
                      this.closeSelf = true;
                      this.identifierStack.pop();
                      return true;
                  }
                  this.tokenReader.unread();
                  return false;
              }
              if (((_c = this.tokenReader.peek()) === null || _c === void 0 ? void 0 : _c.value) === ">") {
                  // this.parentNode.children?.push(
                  //   this.createASTNode(
                  //     FinalTokenType.RightBracket,
                  //     undefined,
                  //     this.tokenReader.peek()?.value
                  //   )
                  // );
                  this.tokenReader.read();
                  return true;
              }
              return false;
          };
          Parse.prototype.TagTail = function () {
              var _a, _b, _c, _d, _e, _f;
              this.setCurrentToken(this.tokenReader.peek());
              var node = this.createASTNode(AST.ASTNodeType.TagTail, []);
              (_a = this.parentNode.children) === null || _a === void 0 ? void 0 : _a.push(node);
              this.parentNode = node;
              if (this.currentToken.value === "<") {
                  // this.parentNode.children?.push(
                  //   this.createASTNode(
                  //     FinalTokenType.LeftBracket,
                  //     undefined,
                  //     this.currentToken.value
                  //   )
                  // );
                  this.tokenReader.read();
                  if (((_b = this.tokenReader.peek()) === null || _b === void 0 ? void 0 : _b.type) === JSXTokenizer.BackFlash) {
                      // this.parentNode.children?.push(
                      //   this.createASTNode(
                      //     FinalTokenType.BackFlash,
                      //     undefined,
                      //     this.tokenReader.peek()?.value
                      //   )
                      // );
                      this.tokenReader.read();
                      if (((_c = this.tokenReader.peek()) === null || _c === void 0 ? void 0 : _c.type) === JSXTokenizer.JSXIdentifierType) {
                          this.checkIdentifier();
                          (_d = this.parentNode.children) === null || _d === void 0 ? void 0 : _d.push(this.createASTNode(AST.FinalTokenType.Identifier, undefined, (_e = this.tokenReader.peek()) === null || _e === void 0 ? void 0 : _e.value));
                          this.tokenReader.read();
                          if (((_f = this.tokenReader.peek()) === null || _f === void 0 ? void 0 : _f.value) === ">") {
                              // this.parentNode.children?.push(
                              //   this.createASTNode(
                              //     FinalTokenType.RightBracket,
                              //     undefined,
                              //     this.tokenReader.peek()?.value
                              //   )
                              // );
                              this.tokenReader.read();
                              return true;
                          }
                          this.tokenReader.unread();
                          this.tokenReader.unread();
                          this.tokenReader.unread();
                          return false;
                      }
                      this.tokenReader.unread();
                      this.tokenReader.unread();
                      return false;
                  }
                  this.tokenReader.unread();
                  return false;
              }
              return false;
          };
          return Parse;
      }());
      AST.Parse = Parse;
  })(AST || (AST = {}));

  var Transform;
  (function (Transform) {
      var extractASTParserNodeSet = {};
      [
          AST.ASTNodeType.TagHead,
          AST.ASTNodeType.TagTail,
          AST.ASTNodeType.TagHeadStart,
          AST.ASTNodeType.TagHeadEnd,
      ].forEach(function (key) {
          extractASTParserNodeSet[key.toString()] = true;
      });
      var Transfomer = /** @class */ (function () {
          function Transfomer() {
          }
          Transfomer.prototype.createJSXElement = function (identifier, Attributes, children, ast) {
              var node = {
                  identifier: identifier,
                  Attributes: Attributes,
                  children: children,
                  elementType: ast.elementType,
                  closeSelf: ast.closeSelf,
              };
              return node;
          };
          Transfomer.prototype.transform2JSXElement = function (node) {
              var _this = this;
              var _a;
              var identifier = "Program", Attributes = [], children = [];
              var root = this.createJSXElement(identifier, Attributes, children, node);
              function buildJSXElement(node, parent) {
                  var _this = this;
                  var _a;
                  if (node.type === AST.ASTNodeType.Expr) {
                      var identifier_1, Attributes_1 = [], children_1 = [], element_1;
                      (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(function (child) {
                          var _a;
                          if (child.type === AST.FinalTokenType.Identifier) {
                              identifier_1 = child.value;
                              element_1 =
                                  element_1 ||
                                      _this.createJSXElement(identifier_1, Attributes_1, children_1, node);
                              return;
                          }
                          if (child.type === AST.ASTNodeType.Attribute) {
                              var attr_1 = {
                                  key: "",
                                  value: "",
                              };
                              (_a = child.children) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
                                  if (item.type === AST.FinalTokenType.AttributeKey) {
                                      attr_1.key = item.value;
                                      return;
                                  }
                                  if (item.type === AST.FinalTokenType.AttributeValue) {
                                      attr_1.value = item.value;
                                      return;
                                  }
                              });
                              attr_1.value = attr_1.value || true;
                              Attributes_1.push(attr_1);
                              return;
                          }
                          if (child.type === AST.FinalTokenType.Comment) {
                              children_1.push({
                                  identifier: "[[Comment]]",
                                  Attributes: [],
                                  value: child.value,
                              });
                              return;
                          }
                          if (child.type === AST.FinalTokenType.Text) {
                              element_1 = _this.createJSXElement('[[Text]]', Attributes_1, children_1, node);
                              delete element_1.children;
                              element_1.value = child.value;
                              return;
                          }
                          if (child.type === AST.ASTNodeType.Expr) {
                              buildJSXElement.call(_this, child, element_1);
                          }
                      });
                      if (!parent.children)
                          throw TypeError("parent should have children");
                      if (!element_1)
                          element_1 = this.createJSXElement(identifier_1, Attributes_1, children_1, node);
                      parent.children.push(element_1);
                  }
              }
              (_a = node.children) === null || _a === void 0 ? void 0 : _a.forEach(function (item) { return buildJSXElement.call(_this, item, root); });
              root.elementType = 'Program';
              return root;
          };
          Transfomer.prototype.extractASTParserNode = function (node) {
              var extractedNode = Object.assign({}, node);
              function extract(child) {
                  if (extractASTParserNodeSet[child.type.toString()]) {
                      if (!child.children)
                          return [child];
                      return child.children.map(function (item) { return extract(item); }).flat();
                  }
                  if (!child.children)
                      return [child];
                  child.children = child.children.map(function (item) { return extract(item); }).flat();
                  return [child];
              }
              if (!node.children)
                  return node;
              extractedNode.children = node.children
                  .map(function (item) { return extract(item); })
                  .flat();
              return extractedNode;
          };
          return Transfomer;
      }());
      Transform.Transfomer = Transfomer;
  })(Transform || (Transform = {}));

  var JSXCompiler;
  (function (JSXCompiler) {
      var Compiler = /** @class */ (function () {
          function Compiler() {
              this.tokenizer = createTokenizer(Tokenizer);
              this.astParser = new AST.Parse([]);
              this.transformer = new Transform.Transfomer();
              this.tokens = [];
              // compileFile(options: compileFileOptions): AST.ASTNode {
              //   let template = fs.readFileSync(options.path).toString();
              //   return this.compile(template);
              // }
          }
          Compiler.prototype.compile = function (template) {
              console.log("================== Compile Start ====================");
              this.tokens = this.tokenizer.run(template);
              this.ast = this.astParser.createAST(this.tokens);
              this.ast = this.transformer.extractASTParserNode(this.ast);
              this.jsxElement = this.transformer.transform2JSXElement(this.ast);
              console.log("Transform Success!");
              console.log("================== Compile Success! ====================");
              return this.ast;
          };
          return Compiler;
      }());
      JSXCompiler.Compiler = Compiler;
  })(JSXCompiler || (JSXCompiler = {}));

  var Parse = AST.Parse;
  var Compiler = JSXCompiler.Compiler;

  exports.Compiler = Compiler;
  exports.Parse = Parse;
  exports.Tokenizer = Tokenizer;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}));
//# sourceMappingURL=compiler.global.js.map
