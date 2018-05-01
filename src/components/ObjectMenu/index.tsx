import * as React from 'react';
import { connect } from 'react-redux';
import { Menu } from 'semantic-ui-react';
import * as T from '../../types';
import * as SL from '../../types/selection';
import * as SM from '../../types/sense-map';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import * as OE from '../../types/object-editor';

interface StateFromProps {
  selection: SL.State;
  objects: SO.State['objects'];
  scope: SM.State['scope'];
}

interface DispatchFromProps {
  actions: {
    selectObject: typeof OE.actions.selectObject,
    addCardToBox(card: SO.ObjectID, box: SB.BoxID): Promise<T.Action>,
    removeCardFromBox(card: SO.ObjectID, box: SB.BoxID): Promise<T.Action>,
  };
}

type Props = StateFromProps & DispatchFromProps;

function selectedCardsAndBoxes(props: Props): { cards: SO.ObjectID[], boxes: SO.ObjectID[] } {
  let cards: SO.ObjectID[] = [];
  let boxes: SO.ObjectID[] = [];
  props.selection.forEach(id => {
    switch (props.objects[id].objectType) {
      case SO.ObjectType.CARD: {
        cards = [...cards, id];
        break;
      }
      case SO.ObjectType.BOX: {
        boxes = [...boxes, id];
        break;
      }
      default: {
        // noop
      }
    }
  });
  return { cards, boxes };
}

class ObjectMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.canAddCard = this.canAddCard.bind(this);
    this.handleAddCard = this.handleAddCard.bind(this);
    this.canRemoveCard = this.canRemoveCard.bind(this);
    this.handleRemoveCard = this.handleRemoveCard.bind(this);
  }

  canAddCard(): Boolean {
    if (this.props.scope.type !== SM.MapScopeType.FULL_MAP) {
      return false;
    }
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    return cards.length === 1 && boxes.length === 1;
  }

  handleAddCard(): void {
    if (!this.canAddCard()) {
      return;
    }
    const { cards, boxes } = selectedCardsAndBoxes(this.props);
    this.props.actions.addCardToBox(cards[0], this.props.objects[boxes[0]].data);
    return;
  }

  canRemoveCard(): Boolean {
    return this.props.scope.type === SM.MapScopeType.BOX
      && this.props.selection.length === 1;
  }

  handleRemoveCard(): void {
    if (!this.canRemoveCard()) {
      return;
    }
    const card = this.props.selection[0];
    const box  = this.props.scope.box;
    if (!box) {
      throw Error('This cannot happen: map scope has type BOX with null box ID.');
    }
    this.props.actions.removeCardFromBox(card, box);
    return;
  }

  render() {
    const { actions, selection } = this.props;

    return (
      <Menu vertical>
        <Menu.Item>{
          selection.length === 0
            ? '功能選單'
            : `選取了 ${selection.length} 張卡片`
        }</Menu.Item>
        <Menu.Item
          name="edit"
          disabled={selection.length !== 1}
          onClick={() => actions.selectObject(selection[0])}
        >
          編輯
        </Menu.Item>
        <Menu.Item
          name="addCard"
          disabled={!this.canAddCard()}
          onClick={this.handleAddCard}
        >
          加入
        </Menu.Item>
        <Menu.Item
          name="removeCard"
          disabled={!this.canRemoveCard()}
          onClick={this.handleRemoveCard}
        >
          退出
        </Menu.Item>
      </Menu>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps>(
  (state: T.State) => ({
    selection: state.selection,
    scope: state.senseMap.scope,
    objects: state.senseObject.objects,
  }),
  (dispatch: T.Dispatch) => ({
    actions: {
      selectObject: (id: SO.ObjectID | null) => dispatch(T.actions.editor.selectObject(id)),
      addCardToBox: (card: SO.ObjectID, box: SB.BoxID) =>
        dispatch(T.actions.senseObject.addCardToBox(card, box)),
      removeCardFromBox: (card: SO.ObjectID, box: SB.BoxID) =>
        dispatch(T.actions.senseObject.removeCardFromBox(card, box)),
    }
  })
)(ObjectMenu);
