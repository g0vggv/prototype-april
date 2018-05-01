
import * as React from 'react';
import { Stage, Layer } from 'react-konva';
import MapBox from '../MapBox';
import MapCard from '../MapCard';
import { Group } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import * as SL from '../../types/selection';
import * as T from '../../types';

export interface StateFromProps {
  selection: T.State['selection'];
  objects:   T.State['senseObject']['objects'];
  cards:     T.State['senseObject']['cards'];
  boxes:     T.State['senseObject']['boxes'];
}

export interface DispatchFromProps {
  actions: {
    toggleObjectSelection(id: SO.ObjectID): T.ThunkedAction,
    moveObject(id: SO.ObjectID, x: number, y: number): T.ThunkedAction,
    addCardToBox(card: SO.ObjectID, box: SB.BoxID): T.ThunkedAction,
    removeCardFromBox(card: SO.ObjectID, box: SB.BoxID): T.ThunkedAction,
    openBox(box: SB.BoxID): T.ThunkedAction,
  };
}

export interface OwnProps {
  width: number;
  height: number;
}

export type Props = StateFromProps & DispatchFromProps & OwnProps;

const renderObject = (o: SO.ObjectData, props: Props) => {
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
};

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
