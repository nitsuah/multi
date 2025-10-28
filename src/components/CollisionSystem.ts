import * as THREE from "three";

export class CollisionSystem {
  private boundaries: THREE.Box3[];
  private playerRadius: number;

  constructor() {
    this.boundaries = [];
    this.playerRadius = 0.25; // Half the width of the player box
    this.initializeBoundaries();
  }

  private initializeBoundaries() {
    // Create world boundaries (invisible walls)
    const worldSize = 50;

    // North boundary
    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(-worldSize, -10, worldSize),
        new THREE.Vector3(worldSize, 10, worldSize + 1)
      )
    );

    // South boundary
    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(-worldSize, -10, -worldSize - 1),
        new THREE.Vector3(worldSize, 10, -worldSize)
      )
    );

    // East boundary
    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(worldSize, -10, -worldSize),
        new THREE.Vector3(worldSize + 1, 10, worldSize)
      )
    );

    // West boundary
    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(-worldSize - 1, -10, -worldSize),
        new THREE.Vector3(-worldSize, 10, worldSize)
      )
    );

    // Add some obstacles in the world
    // Central pillar
    this.boundaries.push(
      new THREE.Box3(new THREE.Vector3(-2, 0, -2), new THREE.Vector3(2, 4, 2))
    );

    // Corner obstacles
    this.boundaries.push(
      new THREE.Box3(new THREE.Vector3(15, 0, 15), new THREE.Vector3(20, 3, 20))
    );

    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(-20, 0, -20),
        new THREE.Vector3(-15, 3, -15)
      )
    );

    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(15, 0, -20),
        new THREE.Vector3(20, 3, -15)
      )
    );

    this.boundaries.push(
      new THREE.Box3(
        new THREE.Vector3(-20, 0, 15),
        new THREE.Vector3(-15, 3, 20)
      )
    );
  }

  checkCollision(
    currentPosition: THREE.Vector3,
    newPosition: THREE.Vector3
  ): THREE.Vector3 {
    const playerBox = new THREE.Box3(
      new THREE.Vector3(
        newPosition.x - this.playerRadius,
        newPosition.y - 0.5,
        newPosition.z - this.playerRadius
      ),
      new THREE.Vector3(
        newPosition.x + this.playerRadius,
        newPosition.y + 0.5,
        newPosition.z + this.playerRadius
      )
    );

    // Check collision with all boundaries
    for (const boundary of this.boundaries) {
      if (playerBox.intersectsBox(boundary)) {
        // Collision detected, calculate the best position to move to
        return this.resolveCollision(currentPosition, newPosition, boundary);
      }
    }

    return newPosition; // No collision
  }

  private resolveCollision(
    currentPos: THREE.Vector3,
    newPos: THREE.Vector3,
    boundary: THREE.Box3
  ): THREE.Vector3 {
    const resolved = currentPos.clone();

    // Try moving only in X direction
    const testX = new THREE.Vector3(newPos.x, currentPos.y, currentPos.z);
    const testBoxX = new THREE.Box3(
      new THREE.Vector3(
        testX.x - this.playerRadius,
        testX.y - 0.5,
        testX.z - this.playerRadius
      ),
      new THREE.Vector3(
        testX.x + this.playerRadius,
        testX.y + 0.5,
        testX.z + this.playerRadius
      )
    );

    if (!testBoxX.intersectsBox(boundary)) {
      resolved.x = newPos.x;
    }

    // Try moving only in Z direction
    const testZ = new THREE.Vector3(currentPos.x, currentPos.y, newPos.z);
    const testBoxZ = new THREE.Box3(
      new THREE.Vector3(
        testZ.x - this.playerRadius,
        testZ.y - 0.5,
        testZ.z - this.playerRadius
      ),
      new THREE.Vector3(
        testZ.x + this.playerRadius,
        testZ.y + 0.5,
        testZ.z + this.playerRadius
      )
    );

    if (!testBoxZ.intersectsBox(boundary)) {
      resolved.z = newPos.z;
    }

    return resolved;
  }

  checkPlayerCollision(
    player1Pos: THREE.Vector3,
    player2Pos: THREE.Vector3
  ): boolean {
    const distance = player1Pos.distanceTo(player2Pos);
    return distance < this.playerRadius * 2 + 0.1; // Small buffer
  }

  // Get boundary geometry for rendering (optional, for debugging)
  getBoundaryGeometry(): THREE.BufferGeometry[] {
    return this.boundaries.map((boundary) => {
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      boundary.getSize(size);
      boundary.getCenter(center);

      const geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
      geometry.translate(center.x, center.y, center.z);
      return geometry;
    });
  }
}

export default CollisionSystem;
