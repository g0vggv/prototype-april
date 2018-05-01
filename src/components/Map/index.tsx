
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import { Group } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SC from '../../types/sense-card';
import * as SB from '../../types/sense-box';
import * as SL from '../../types/selection';
import * as T from '../../types';

export interface StateFromProps {
  selection: SO.ObjectID[];
  objects: { [key: string]: SO.ObjectData };
  cards:   { [key: string]: SC.CardData };
  boxes:   { [key: string]: SB.BoxData };
}

export interface DispatchFromProps {
  actions: {
    toggleObjectSelection(id: SO.ObjectID): T.Action,
    moveObject(id: SO.ObjectID, x: number, y: number): Promise<T.Action>,
    addCardToBox(card: SO.ObjectID, box: SB.BoxID): Promise<T.Action>,
    removeCardFromBox(card: SO.ObjectID): Promise<T.Action>,
    openBox(box: SB.BoxID): T.Action,
  };
}

export interface OwnProps {
  width: number;
  height: number;
}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

function renderObject(o: SO.ObjectData, props: Props) {
  const toggleSelection = props.actions.toggleObjectSelection;
  const moveObject = props.actions.moveObject;
  const openBox = props.actions.openBox;
  switch (o.objectType) {
    case SO.ObjectType.NONE: {
      return <Group />;
    }
    case SO.ObjectType.CARD: {
      if (!props.cards[o.data]) {
        return <Group />;
      }
      return (
        <MapCard
          mapObject={o}
          card={props.cards[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
          moveObject={moveObject}
        />);
    }
    case SO.ObjectType.BOX: {
      if (!props.boxes[o.data]) {
        return <Group />;
      }
      return (
        <MapBox
          mapObject={o}
          box={props.boxes[o.data]}
          selected={SL.contains(props.selection, o.id)}
          toggleSelection={toggleSelection}
          moveObject={moveObject}
          openBox={openBox}
        />);
    }
    default: {
      throw Error(`Unknown ObjectData type ${o.objectType}`);
    }
  }
}

export function Map(props: Props) {
  const objects = Object.values(props.objects).map(o => renderObject(o, props));
  return (
    <Stage width={props.width} height={props.height}>
      <Layer>
        {objects}
      </Layer>
    </Stage>
  );
}

export default Map;
