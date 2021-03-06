import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { Divider, Button } from 'semantic-ui-react';
import CardContent from '../CardContent';
import BoxContent from '../BoxContent';
import * as T from '../../types';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import './index.css';

type Data
  = SC.CardData
  | SB.BoxData;

interface Props {
  objectType: T.ObjectType;
  data: Data;
  changeText?: string;
  onChange? (value: Data): void;
  onCancel? (): void;
}

interface State {
  data: Data;
}

class ObjectContent extends React.Component<Props, State> {
  static defaultProps = {
    objectType: T.ObjectType.CARD,
    data: SC.emptyCardData
  };

  constructor(props: Props) {
    super(props);

    const { objectType, data } = props;

    switch (objectType) {
      case T.ObjectType.CARD:
        this.state = {
          data: SC.reducer(data as SC.CardData)
        };
        break;
      case T.ObjectType.BOX:
        this.state = {
          data: SB.reducer(data as SB.BoxData)
        };
        break;
      default:
        this.state = {
          data: SC.emptyCardData
        };
    }

  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.data !== nextProps.data) {
      const { objectType, data } = nextProps;

      switch (objectType) {
        case T.ObjectType.CARD:
          this.setState({
            data: SC.reducer(data as SC.CardData)
          });
          break;
        case T.ObjectType.BOX:
          this.setState({
            data: SB.reducer(data as SB.BoxData)
          });
          break;
        default:
      }
    }
  }

  handleChange = (action: SC.Action | SB.Action) => {
    const { objectType } = this.props;
    const { data } = this.state;

    switch (objectType) {
      case T.ObjectType.CARD:
        this.setState({
          data: SC.reducer(data as SC.CardData, action as SC.Action)
        });
        break;
      case T.ObjectType.BOX:
        this.setState({
          data: SB.reducer(data as SB.BoxData, action as SB.Action)
        });
        break;
      default:
    }

  }

  handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case Key.Enter:
        this.handleSave();
        break;
      case Key.Escape:
        this.handleCancel();
        break;
      default:
    }
  }

  handleSave = () => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(this.state.data);
    }
  }

  handleCancel = () => {
    const { objectType, data } = this.props;

    switch (objectType) {
      case T.ObjectType.CARD:
        this.setState({
          data: SC.reducer(data as SC.CardData)
        });
        break;
      case T.ObjectType.BOX:
        this.setState({
          data: SB.reducer(data as SB.BoxData)
        });
        break;
      default:
    }
  }

  render() {
    const { objectType, changeText, onCancel } = this.props;
    const { data } = this.state;

    let content;
    switch (objectType) {
      case T.ObjectType.CARD:
        content = (
          <CardContent
            data={data as SC.CardData}
            onKeyUp={this.handleKey}
            onChange={action => this.handleChange(action)}
          />
        );
        break;
      case T.ObjectType.BOX:
        content = (
          <BoxContent
            data={data as SB.BoxData}
            onKeyUp={this.handleKey}
            onChange={action => this.handleChange(action)}
          />
        );
        break;
      default:
    }

    return (
      <div className="object-content">
        {content}
        <Divider />
        <div className="object-content__actions">
          <Button.Group>
            <Button
              onClick={() => {
                this.handleCancel();
                if (typeof onCancel === 'function') {
                  onCancel();
                }
              }}
            >
              關閉
            </Button>
            <Button.Or />
            <Button positive onClick={this.handleSave}>{changeText || '送出'}</Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}

export default ObjectContent;
