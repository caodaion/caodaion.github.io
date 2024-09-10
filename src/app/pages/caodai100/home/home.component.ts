import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as d3 from 'd3';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Import OrbitControls
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'; // Import OrbitControls


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls; // Declare controls
  private nodes: any[] = [];
  private links: any[] = [];
  private mouse = new THREE.Vector2();
  private targetRotationX = 0
  private targetRotationY = 0
  private rotationSpeed = 0.05;


  chartData = [
    { id: "dao-cao-dai", name: "Đạo Cao Đài", tags: ["ig"] },
    { id: "toa-thanh-tay-tinh", name: "Tòa Thánh Tây Ninh", pid: "dao-cao-dai" },
    { id: "ban-chinh-dao", name: "Ban Chỉnh Đạo", pid: "dao-cao-dai" },
    { id: "chieu-minh", name: "Chiếu Minh", pid: "dao-cao-dai" },
    { id: "tien-thien", name: "Tiên Thiên", pid: "dao-cao-dai" },
    { id: "truyen-giao", name: "Truyền Giáo", pid: "dao-cao-dai" },
    { id: "toa-thanh-tay-tinh-ban-dai-dien-ben-tre", name: "Ban Đại Diện Bến Tre", pid: "toa-thanh-tay-tinh" },
    { id: "ban-chinh-dao-ban-dai-dien-ben-tre", name: "Ban Đại Diện Bến Tre", pid: "ban-chinh-dao" },
    { id: "ban-chinh-dao-ban-dai-dien-ben-tre-thanh-that-an-hoi", name: "Thánh Thất An Hội", pid: "ban-chinh-dao-ban-dai-dien-ben-tre" },
    { id: "ban-chinh-dao-ban-dai-dien-ben-tre-thanh-that-binh-phu", name: "Thánh Thất Bình Phú", pid: "ban-chinh-dao-ban-dai-dien-ben-tre" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong", name: "Ban Đại Diện Lâm Đồng", pid: "ban-chinh-dao" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-da-lat", name: "Thánh Thất Đà Lạt", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-bong-lai", name: "Thánh Thất Bồng Lai", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-xuan-son", name: "Thánh Thất Xuân Sơn", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-phu-son", name: "Thánh Thất Phú Sơn", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
    { id: "ban-chinh-dao-ban-dai-dien-lam-dong-thanh-that-quang-lac", name: "Thánh Thất Quảng Lạc", pid: "ban-chinh-dao-ban-dai-dien-lam-dong" },
    { id: "tien-thien-ban-dai-dien-ben-tre", name: "Ban Đại Diện Bến Tre", pid: "tien-thien" },
    { id: "truyen-giao-ban-dai-dien-ben-tre", name: "Ban Đại Diện Bến Tre", pid: "truyen-giao" },
  ]


  messages = [
    `SỰ THƯƠNG YÊU LÀ GIỀNG BẢO SANH CỦA CÀN KHÔN THẾ GIỚI.`,
    `Đạo gốc bởi lòng thành tín hiệp`,
    `Trong Tam Giáo có lời khuyến dạy
Gốc bởi lòng làm phải làm lành`,
    `Một cội sanh ba nhánh in nhau`,
    `Nam Mô:
    Nhứt nguyện: Đại Đạo hoằng khai.
    Nhì nguyện: Phổ độ chúng sanh.
    Tam nguyện: Xá tội đệ tử.
    Tứ nguyện: Thiên hạ thái bình.
    Ngũ nguyện: Thánh Thất an ninh.`,
    `Muôn kiếp có Ta nắm chủ quyền,
Vui lòng tu niệm hưởng ân Thiên.
Đạo màu rưới khắp nơi trần thế,
Ngàn tuổi muôn tên giữ trọn biên.`,
  ]
  message = this.messages[0]

  constructor(private renderer2: Renderer2) {}

  ngOnInit(): void {
    this.initThreeJS();
    this.createMindMap();
    this.animate();
    this.startMessageRotation();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 20);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.scene.background = new THREE.Color(0xffffff);

    this.addLights();
  }

  private addLights() {
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);
  }

  private createMindMap() {
    this.chartData.forEach((item) => {
      this.nodes.push({ id: item.id, name: item.name });
      if (item.pid) {
        this.links.push({ source: item.pid, target: item.id, linkColor: Math.random() * 0xffffff });
      }
    });

    this.assignPositions(this.nodes, this.links);
    this.loadTexturesAndNodes();
    this.createSimulation();
  }

  private loadTexturesAndNodes() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/images/divine-eye.png', (texture) => {
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(0, 0, 0);
      this.scene.add(sprite);
    });

    this.nodes.forEach((node, index) => {
      if (index !== 0) {
        const sphere = this.createSphere(node);
        this.scene.add(sphere);
        const label = this.createTextSprite(node.name);
        label.position.set(node.x!, node.y! - 2, node.z || 0);
        this.scene.add(label);
      }
    });

    this.links.forEach(link => this.createLink(link));
  }

  private createSphere(node: any): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(node.x!, node.y!, node.z || 0);
    sphere.name = node.id;
    return sphere;
  }

  private createLink(link: any) {
    const sourceNode = this.nodes.find(node => node.id === link.source);
    const targetNode = this.nodes.find(node => node.id === link.target);

    if (sourceNode && targetNode) {
      const material = new THREE.LineBasicMaterial({ color: link.linkColor, linewidth: 10 });
      const points = [new THREE.Vector3(sourceNode.x!, sourceNode.y!, sourceNode.z || 0), 
                      new THREE.Vector3(targetNode.x!, targetNode.y!, targetNode.z || 0)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      this.scene.add(line);
    }
  }

  private assignPositions(nodes: any, links: any, radius: number = 10) {
    const root = nodes.find((node: any) => !links.some((link: any) => link.target === node.id));
    if (root) {
      this.positionNode(root, nodes, links, 0, 0, 0, radius);
    }
  }

  private positionNode(node: any, nodes: any, links: any, x: number, y: number, z: number, radius: number) {
    node.x = x;
    node.y = y;
    node.z = z;
    const children = links.filter((link: any) => link.source === node.id).map((link: any) => nodes.find((n: any) => n.id === link.target)!);

    children.forEach((child: any, index: any) => {
      const angle = (index / children.length) * Math.PI * 2;
      const childX = x + Math.cos(angle) * radius;
      const childY = y + Math.sin(angle) * radius;
      const childZ = z + (Math.random() - 0.5) * radius;
      this.positionNode(child, nodes, links, childX, childY, childZ, radius * 0.7);
    });
  }

  private createSimulation() {
    d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.links).id((d: any) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(0, 0))
      .on('tick', () => this.updateNodePositions(this.nodes));
  }

  private updateNodePositions(nodes: any) {
    this.scene.children.forEach(obj => {
      if (obj instanceof THREE.Mesh) {
        const node = nodes.find((n: any) => n.id === obj.name);
        if (node) {
          // obj.position.set(node.x!, node.y!, node.z || 0);
        }
      }
    });
  }

  private createTextSprite(message: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    context.font = '24px Arial';
    context.fillStyle = '#000000';
    context.fillText(message, 0, 24);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(4, 2, 1);
    return sprite;
  }

  private animate() {
    requestAnimationFrame(() => this.animate());
    this.camera.rotation.x += (this.targetRotationX - this.camera.rotation.x) * this.rotationSpeed;
    this.camera.rotation.y += (this.targetRotationY - this.camera.rotation.y) * this.rotationSpeed;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  private startMessageRotation() {
    setInterval(() => {
      const randomIndex = Math.floor(Math.random() * this.messages.length);
      this.message = this.messages[randomIndex];
    }, 4000);
  }
}
