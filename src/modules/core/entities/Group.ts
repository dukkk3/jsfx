import { AbstractRenderTarget } from "./abstracts/AbstractRenderTarget";

type Children = AbstractRenderTarget | Group;

export class Group extends AbstractRenderTarget {
	private _children: Children[];

	constructor() {
		super();
		this._children = [];
	}

	public addChildren(...children: Children[]): void {
		this._children.push(...children);
	}

	public getChildren(): Children[] {
		return this._children;
	}
}
