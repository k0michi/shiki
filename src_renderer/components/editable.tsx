import * as React from 'react'
import { CursorRange, getCursorRange, setCursorRange } from '../cursor';

export interface EditableRef {
  focus();
}

export interface EditableProps {
  html?: string;
  onInput?: (html: string) => void;
  component: React.FC<any>;
  placeholder?: string;
  ref?: EditableRef;
}

const Editable = React.forwardRef<EditableRef, EditableProps>(function (props, ref) {
  const element = React.useRef<HTMLHeadingElement>(null);
  const compositing = React.useRef(false);
  const range = React.useRef<CursorRange>();
  const [focused, setFocused] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    focus() {
      if (element.current != null) {
        element.current.focus();
        window.getSelection()?.selectAllChildren(element.current);
        window.getSelection()?.collapseToEnd();
      }
    }
  }));

  React.useEffect(() => {
    if (range.current != null) {
      setCursorRange(element.current!, range.current);
    }
  }, [props.html]);

  const onInput = React.useCallback((e) => {
    if (!compositing.current) {
      range.current = getCursorRange(element.current!);
      if (props.onInput != null) {
        props.onInput(e.target.innerHTML);
      }
    }
  }, [props.onInput]);

  const showPlaceholder = props.placeholder != null && (props.html == null || (!focused && props.html.length == 0));

  return (
    <props.component
      className={showPlaceholder ? 'placeholder' : ''}
      ref={element}
      contentEditable
      onFocus={e => setFocused(true)}
      onBlur={e => setFocused(false)}
      onKeyDown={e => {
        if (!compositing.current && e.key == 'Enter') {
          (e.target as HTMLHeadingElement).blur()
        }
      }}
      onInput={onInput}
      onCompositionStart={e => compositing.current = true}
      onCompositionEnd={e => {
        compositing.current = false;
        onInput(e);
      }}
      onPaste={e => {
        const paste = e.clipboardData.getData('text');
        const selection = window.getSelection();

        if (selection != null && selection.rangeCount > 0) {
          selection.deleteFromDocument();
          selection.getRangeAt(0).insertNode(document.createTextNode(paste));
          selection.collapseToEnd();
          onInput(e);
        }

        e.preventDefault();
      }}
      onDrop={e => {
        e.preventDefault();
      }}
      dangerouslySetInnerHTML={{ __html: showPlaceholder ? props.placeholder : props.html }}>
    </props.component>
  );
});

const P = React.forwardRef((props, ref: React.Ref<HTMLParagraphElement>) => (
  <p ref={ref} {...props} />
));

export function EditableParagraph(props: any) {
  return <Editable component={P} {...props}></Editable>
}

const H1 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h1 ref={ref} {...props} />
));

export function EditableH1(props: any) {
  return <Editable component={H1} {...props}></Editable>
}

const H2 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h2 ref={ref} {...props} />
));

export function EditableH2(props: any) {
  return <Editable component={H2} {...props}></Editable>
}

const H3 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h3 ref={ref} {...props} />
));

export function EditableH3(props: any) {
  return <Editable component={H3} {...props}></Editable>
}

const H4 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h4 ref={ref} {...props} />
));

export function EditableH4(props: any) {
  return <Editable component={H4} {...props}></Editable>
}

const H5 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h5 ref={ref} {...props} />
));

export function EditableH5(props: any) {
  return <Editable component={H5} {...props}></Editable>
}

const H6 = React.forwardRef((props, ref: React.Ref<HTMLHeadingElement>) => (
  <h6 ref={ref} {...props} />
));

export function EditableH6(props: any) {
  return <Editable component={H6} {...props}></Editable>
}

const Pre = React.forwardRef((props, ref: React.Ref<HTMLPreElement>) => (
  <pre ref={ref} {...props} />
));

export const EditablePre = React.forwardRef(function (props: any, ref) {
  return <Editable ref={ref} component={Pre} {...props}></Editable>
});