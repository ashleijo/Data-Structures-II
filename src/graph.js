/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-trailing-spaces */
/* eslint-disable class-methods-use-this */
// Do not modify this GraphNode class
// Use any of its methods as you see fit to implement your graph
class GraphNode {
  constructor({ value, edges }) {
    this._value = value;
    this._edges = edges;
  }

  get value() {
    return this._value;
  }

  get edges() {
    return this._edges;
  }

  get numberOfEdges() {
    return this._edges.length;
  }

  set edges(x) {
    this._edges = x;
  }

  pushToEdges(y) {
    this._edges.push(y);
  }
}

class Graph {
  constructor() {
    this.vertices = [];
  }
  // Wraps the input value in a new GraphNode and adds it to the array of vertices
  // If there are only two nodes in the graph, they need to be automatically
  // connected via an edge
  // Optionally accepts an array of other GraphNodes for the new vertex to be connected to
  // Returns the newly-added vertex
  addVertex(value, edges = []) {
    // Creates a new GraphNode with the paramaters given.
    const newGraphNode = new GraphNode({ value, edges });
    newGraphNode.edges.forEach((edge) => {
      this.addEdge(newGraphNode, edge);
    });
    // Connects via edge if there are only two nodes.
    this.vertices.push(newGraphNode);
    if (this.vertices.length === 2) { // I understand that I have to push to the edges first now!
      this.addEdge(this.vertices[0], this.vertices[1]); // then it will count correctly.
    }
    return newGraphNode;
  }
  // Checks all the vertices of the graph for the target value
  // Returns true or false
  contains(value) {
    // .some() method tests whether at least one element in the array passes
    // the test implemented by the provided function!
    return this.vertices.some(vertex => vertex.value === value);
    // for (let i = 0; i < this.vertices.length; i++) {
    //  if (this.vertices[i].value === value) {
    //    return true;
    //  }
    // }
    // return false;
    //
    // let hasValue = false;
    // this.vertices.forEach((node) => {
    //  if (node.value === value) {
    //    hasValue = true;
    //    return;
    //  }
    // });
    // return hasValue;
  }
  // Checks the graph to see if a GraphNode with the specified value exists in the graph
  // and removes the vertex if it is found
  // This function should also handle the removing of all edge references for the removed vertex
  removeVertex(value) {
    const keepThese = [];
    let removeThis;
    for (let i = 0; i < this.vertices.length; i++) {
      if (this.vertices[i].value === value) {
        removeThis = this.vertices[i];
      } else {
        keepThese.push(this.vertices[i]);
      }
    }
    this.vertices = keepThese;
    removeThis.edges.forEach((vertex) => {
      this.removeEdge(removeThis, vertex);
    });
  }
  // Checks the two input vertices to see if each one references the other in their respective edges array
  // Both vertices must reference each other for the edge to be considered valid
  // If only one vertex references the other but not vice versa, should not return true
  // Note: You'll need to store references to each vertex's array of edges so that you can use
  // array methods on said arrays. There is no method to traverse the edge arrays built into the GraphNode class
  checkIfEdgeExists(fromVertex, toVertex) {
    return (fromVertex.edges.includes(toVertex) && toVertex.edges.includes(fromVertex));
  }
  // Adds an edge between the two given vertices if no edge already exists between them
  // Again, an edge means both vertices reference the other
  addEdge(fromVertex, toVertex) {
    if (!fromVertex.edges.includes(toVertex)) {
      fromVertex.pushToEdges(toVertex);
    }
    if (!toVertex.edges.includes(fromVertex)) {
      toVertex.pushToEdges(fromVertex);
    }
    // .filter() will filters out the possible duplicate that was a result of the code above.
    fromVertex.edges = fromVertex.edges.filter((edge, i) => {
      return fromVertex.edges.indexOf(edge) === i;
    });
    toVertex.edges = toVertex.edges.filter((edge, i) => {
      return toVertex.edges.indexOf(edge) === i;
    });
  }
  // Removes the edge between the two given vertices if an edge already exists between them
  // After removing the edge, neither vertex should be referencing the other
  // If a vertex would be left without any edges as a result of calling this function, those
  // vertices should be removed as well
  removeEdge(fromVertex, toVertex) {
    if (!this.checkIfEdgeExists(fromVertex, toVertex)) {
      return false;
    }
    // .filter() method creates a new array with all elements that pass the test
    // implemented by the provided function; The function used below is creating an array
    // of verticies where the vertex value is not equal to other verticies. Those arrays, now
    // discluding the filtered edge, are assigned back to their respective edges.
    fromVertex.edges = fromVertex.edges.filter(vertex => vertex.value !== toVertex.value);
    toVertex.edges = toVertex.edges.filter(vertex => vertex.value !== fromVertex.value);
    // Below will remove the respective verticies if the number of vertex edges
    // falls to zero.
    if (fromVertex.numberOfEdges === 0) {
      this.removeVertex(fromVertex.value);
    }
    if (toVertex.numberOfEdges === 0) {
      this.removeVertex(toVertex.value);
    }
  }
}

module.exports = Graph;
