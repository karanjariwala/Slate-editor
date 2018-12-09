// Import the `Value` model.
import React from 'react';
import { Editor } from 'slate-react'
import Html from 'slate-html-serializer'


const BLOCK_TAGS = {
    blockquote: 'quote',
    p: 'paragraph',
    pre: 'code',
  };
  // Add a dictionary of mark tags.
  const MARK_TAGS = {
    em: 'italic',
    strong: 'bold',
    u: 'underline',
    code: 'code',
    del: 'strikethrough'
  };
  const rules = [
    {
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'block',
            type: type,
            data: {
              className: el.getAttribute('class'),
            },
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object === 'block') {
          switch (obj.type) {
            case 'code':
              return (
                <pre>
                  <code>{children}</code>
                </pre>
              )
            case 'paragraph':
              return <p className={obj.data.get('className')}>{children}</p>
            case 'quote':
              return <blockquote>{children}</blockquote>
          }
        }
      },
    },
    // Add a new rule that handles marks...
    {
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'mark',
            type: type,
            nodes: next(el.childNodes),
          }
        }
      },
      serialize(obj, children) {
        if (obj.object == 'mark') {
          switch (obj.type) {
            case 'bold':
              return <strong>{children}</strong>
            case 'italic':
              return <em>{children}</em>
            case 'underline':
              return <u>{children}</u>
            case 'code':
              return <code>{children}</code>
            case 'strikethrough':
              return <del>{children}</del>
          }
        }
      },
    },
  ];



function MarkHotkey(options) {
    const { type, key } = options
    // Return our "plugin" object, containing the `onKeyDown` handler.
return {
    onKeyDown: (event, editor, next) => {
        // If it doesn't match our `key`, let other plugins handle it.
        debugger;
        if (!event.ctrlKey || event.key !== key) {return next();}
        // Prevent the default characters from being inserted.
        event.preventDefault();
        // Toggle the mark `type`.
        editor.toggleMark(type);
        return next();
    },
    }
};
// Create an array of plugins.
const plugins = [
    MarkHotkey({ key: 'b', type: 'bold' }),
    MarkHotkey({ key: '`', type: 'code' }),
    MarkHotkey({ key: 'i', type: 'italic' }),
    MarkHotkey({ key: '-', type: 'strikethrough' }),
    MarkHotkey({ key: 'u', type: 'underline' }),
    ];


    const html = new Html({ rules })

const initialValue = localStorage.getItem('content') || '<p></p>'


class TextEditor extends React.Component {
    // Set the initial value when the app is first constructed.
    state = {
        value: html.deserialize(initialValue),
    }
    // On change, update the app's React state with the new editor value.
    onChange = ({ value }) => {
        if (value.document !== this.state.value.document) {
            const string = html.serialize(value)
            localStorage.setItem('content', string)
          }
        this.setState({ value })
    };

  // Add a `renderMark` method to render marks.
renderMark = (props, editor, next) => {
        switch (props.mark.type) {
            case 'bold':
            return <strong>{props.children}</strong>
        // Add our new mark renderers...
        case 'code':
            return <code>{props.children}</code>
        case 'italic':
            return <em>{props.children}</em>
        case 'strikethrough':
            return <del>{props.children}</del>
        case 'underline':
            return <u>{props.children}</u>
        default:
            return next()
        }
    }
  

    // Render the editor.
    render(){
        return (
        <Editor 
            plugins={plugins}
            value={this.state.value} 
            onChange={this.onChange}
            renderMark={this.renderMark} />)
    }
}


  export default TextEditor;