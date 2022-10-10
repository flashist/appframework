export class SizeDistributor {

    /*protected config: SizeDistributorConfig;
    protected sizePerChild: Dictionary<any, Point>;

    constructor(config?: Partial<SizeDistributorConfig>) {
        this.config = new SizeDistributorConfig();
        if (config) {
            (Object as any).assign(this.config, config);
        }
    }

    updateSize(container: ILayoutableContainer<ISizeDistributorChild>, width: number, height: number): void {

        this.sizePerChild = new Dictionary<any, Point>();

        let childrenCount: number = container.layoutGetChildrenNum();

        let tempChild: ISizeDistributorChild;
        let tempChildWidth: number;
        let tempChildHeight: number;
        //
        let defaultChildWidth: number = 0;
        let defaultChildHeight: number = 0;
        //
        let tempSize: Point;

        // Find distribution and predefined size values
        let totalPredefinedWidth: number = 0;
        let totalPredefinedHeight: number = 0;
        //
        let predefinedWidthChildren: ISizeDistributorChild[] = [];
        let predefinedHeightChildren: ISizeDistributorChild[] = [];
        //
        for (let childIndex = 0; childIndex < childrenCount; childIndex++) {
            tempChild = container.layoutGetChildAt(childIndex);

            if (this.config.distributeWidth) {
                if (tempChild.getPredefinedWidth && tempChild.getPredefinedWidth()) {
                    tempChildWidth = tempChild.getPredefinedWidth();
                    predefinedWidthChildren.push(tempChild);
                    totalPredefinedWidth += tempChildWidth;

                    tempSize = this.getSizeForChild(tempChild);
                    tempSize.x = tempChildWidth;
                }
            }

            if (this.config.distributeHeight) {
                if (tempChild.getPredefinedHeight && tempChild.getPredefinedHeight()) {
                    tempChildHeight = tempChild.getPredefinedHeight();
                    predefinedHeightChildren.push(tempChild);
                    totalPredefinedHeight += tempChildHeight;

                    tempSize = this.getSizeForChild(tempChild, true);
                    tempSize.y = tempChildHeight;
                }
            }
        }

        if (this.config.distributeWidth) {
            let totalAvailableWidth: number = width - totalPredefinedWidth - (this.config.paddingX * 2);
            totalAvailableWidth -= (this.config.spacingX * (childrenCount - 1));
            //
            let distributeWidthChildrenCount: number = childrenCount - predefinedWidthChildren.length;
            if (distributeWidthChildrenCount > 0) {
                defaultChildWidth = totalAvailableWidth / distributeWidthChildrenCount;
            }

        } else {
            defaultChildWidth = width;
        }
        // Prevent minus values
        if (defaultChildWidth < 0) {
            defaultChildWidth = 0;
        }

        if (this.config.distributeHeight) {
            let totalAvailableHeight: number = height - totalPredefinedHeight - (this.config.paddingY * 2);
            totalAvailableHeight -= (this.config.spacingY * (childrenCount - 1));
            //
            let distributeHeightChildrenCount: number = childrenCount - predefinedHeightChildren.length;
            if (distributeHeightChildrenCount > 0) {
                defaultChildHeight = totalAvailableHeight / distributeHeightChildrenCount;
            }

        } else {
            defaultChildHeight = height;
        }
        // Prevent minus values
        if (defaultChildHeight < 0) {
            defaultChildHeight = 0;
        }

        if (this.config.isNeedFloorValues) {
            defaultChildWidth = Math.floor(defaultChildWidth);
            defaultChildHeight = Math.floor(defaultChildHeight);
        }

        // Set size
        for (let childIndex = 0; childIndex < childrenCount; childIndex++) {
            tempChild = (container.layoutGetChildAt(childIndex) as ISizeDistributorChild);

            tempSize = this.getSizeForChild(tempChild);
            if (tempSize) {
                if (tempSize.x <= 0) {
                    tempSize.x = defaultChildWidth;
                }
                if (tempSize.y <= 0) {
                    tempSize.y = defaultChildHeight;
                }

                tempChild.resize(tempSize.x, tempSize.y);
            }
        }
    }

    protected getSizeForChild(child: any, isNeedCreate: boolean = true): Point {
        let result: Point = this.sizePerChild.getItem(child);
        if (!result) {
            if (isNeedCreate) {
                this.sizePerChild.addItem(child, new Point());
                result = this.sizePerChild.getItem(child)
            }
        }

        return result;
    }*/
}