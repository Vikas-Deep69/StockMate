class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      const lower = message.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi")) {
        this.actionProvider.handleHello();
      }
      if (lower.includes("bye") || lower.includes("goodbye")) {
        this.actionProvider.handleBye();
      }
       else {
        this.actionProvider.handleDefault();
      }
    }
  }
  
  export default MessageParser;
  