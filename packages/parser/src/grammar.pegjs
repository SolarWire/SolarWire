{
  function isContainer(type) {
    return ['row', 'col', 'table', 'table-row'].indexOf(type) !== -1;
  }
}

Document
  = (Comment / _ / EOL)* items:DocumentItem*
  {
    var declarations = [];
    var elements = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item) {
        if (item.key) {
          declarations.push(item);
        } else if (item.type) {
          elements.push(item);
        }
      }
    }
    return {
      declarations: declarations,
      elements: elements
    };
  }

DocumentItem
  = decl:DocumentDeclaration (Comment / _ / EOL)*
  { return decl; }
  / elem:Element (Comment / _ / EOL)*
  { return elem; }
  / Comment / _ / EOL

DocumentDeclaration
  = "!" key:Identifier "=" value:Value _* (Comment)? EOL
  {
    return { key: key, value: value };
  }
  / "!" key:Identifier _* (Comment)? EOL
  {
    return { key: key, value: 'true' };
  }

Element
  = _* e:(ContainerElement / SimpleElement) _* (Comment)?
  { return e; }

ContainerElement
  = RowContainer / ColContainer / EmptyContainer / TableElement / TableRowElement

SimpleElement
  = CircleElement / RectangleElement / RoundedRectangleElement / TextElement / PlaceholderElement / ImageElement / LineElement

RectangleElement
  = "[" text:QuotedString? "]" rest:ElementRest?
  {
    return {
      type: 'rectangle',
      text: text,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }

RoundedRectangleElement
  = "(" text:QuotedString? ")" rest:ElementRest?
  {
    return {
      type: 'rounded-rectangle',
      text: text,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }

CircleElement
  = "((" text:QuotedString? "))" rest:ElementRest?
  {
    return {
      type: 'circle',
      text: text,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }

TextElement
  = text:QuotedString rest:ElementRest?
  {
    return {
      type: 'text',
      text: text,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }



PlaceholderElement
  = "[?" text:QuotedString? "]" rest:ElementRest?
  {
    return {
      type: 'placeholder',
      text: text,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }

ImageElement
  = "<" url:ImageURL ">" rest:ElementRest?
  {
    return {
      type: 'image',
      url: url,
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null
    };
  }

LineElement
  = "--" label:QuotedString? "--"? _* lineCoords:LineCoordinates attrs:Attributes?
  {
    var result = {
      type: 'line',
      attributes: attrs || {}
    };
    if (label) result.label = label;
    return Object.assign(result, lineCoords);
  }

LineCoordinates
  = "@(" startX:Coordinate _* "," _* startY:Coordinate _* ")->(+" dx:Number _* "," _* "+" dy:Number _* ")"
  {
    return {
      start: { x: startX, y: startY },
      end: { type: 'relative', dx: dx, dy: dy }
    };
  }
  / "@(" startX:Coordinate _* "," _* startY:Coordinate _* ")->(" endX:Coordinate _* "," _* endY:Coordinate _* ")"
  {
    return {
      start: { x: startX, y: startY },
      end: { x: endX, y: endY }
    };
  }

RowContainer
  = "{row}" rest:ElementRest?
  {
    return {
      type: 'row',
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null,
      children: []
    };
  }

ColContainer
  = "{col}" rest:ElementRest?
  {
    return {
      type: 'col',
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null,
      children: []
    };
  }

EmptyContainer
  = "{}" rest:ElementRest?
  {
    return {
      type: 'row',
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null,
      children: []
    };
  }

TableElement
  = "##" rest:ElementRest?
  {
    return {
      type: 'table',
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null,
      children: []
    };
  }

TableRowElement
  = "#" rest:ElementRest?
  {
    return {
      type: 'table-row',
      attributes: rest ? rest.attributes || {} : {},
      coordinates: rest ? rest.coordinates : null,
      children: []
    };
  }

ElementRest
  = coords:Coordinates attrs:Attributes
  {
    return { coordinates: coords, attributes: attrs };
  }
  / coords:Coordinates
  {
    return { coordinates: coords, attributes: {} };
  }
  / attrs:Attributes
  {
    return { coordinates: null, attributes: attrs };
  }

Coordinates
  = _+ "@(" x:Coordinate _* "," _* y:Coordinate _* ")"
  {
    return { x: x, y: y };
  }

Coordinate
  = n:Number
  {
    return { type: 'absolute', value: n };
  }
  / d:Direction _* "+" _* n:Number
  {
    return { type: 'edge', direction: d, value: n };
  }
  / d:Direction _* "-" _* n:Number
  {
    return { type: 'edge', direction: d, value: -n };
  }
  / d:Direction
  {
    return { type: 'edge', direction: d, value: 0 };
  }

Direction
  = "L" / "R" / "T" / "B" / "C"

Attributes
  = _+ firstAttr:Attribute restAttrs:(_+ Attribute)*
  {
    var result = {};
    result[firstAttr.key] = firstAttr.value;
    for (var i = 0; i < restAttrs.length; i++) {
      var attr = restAttrs[i][1];
      result[attr.key] = attr.value;
    }
    return result;
  }

Attribute
  = key:Identifier _* "=" _* value:Value
  {
    return { key: key, value: value };
  }
  / key:Identifier
  {
    return { key: key, value: 'true' };
  }

Identifier
  = [a-zA-Z][a-zA-Z0-9_-]*
  {
    return text();
  }

Value
  = QuotedString
  / SimpleValue

QuotedString
  = "\"\"\"" content:TripleQuotedContent "\"\"\""
  {
    return content;
  }
  / "\"" content:DoubleQuotedContent "\""
  {
    return content;
  }

DoubleQuotedContent
  = (!"\"" .)*
  {
    return text().replace(/\\n/g, '\n').replace(/\\"/g, '"');
  }

TripleQuotedContent
  = (!"\"\"\"" .)*
  {
    return text().trim();
  }

SimpleValue
  = [^ \t\n\r\f\v=]+
  {
    return text();
  }

Number
  = [0-9]+ ("." [0-9]+)?
  {
    return parseFloat(text());
  }

ImageURL
  = [^>]+
  {
    return text();
  }

Comment
  = _* "//" [^\n]* (EOL / !.)

_
  = [ \t]

EOL
  = [\n\r]
