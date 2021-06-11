import { useLayoutEffect, useRef, useState } from "react";

const classMap = new Map<string, string>();
const refMap = new Map<string, number>();
const nodeMap = new Map<string, Text>();

const element = document.createElement("style");

document.head.appendChild(element);

let id = 0;

const getId = () => ++id;

export function useStyle(
  strings: TemplateStringsArray,
  ...expressions: string[]
): string {
  const classRef = useRef(new Set<string>());
  const zippedStrings = strings
    .reduce((acc, cur, i) => {
      let next = i === strings.length - 1 ? cur : `${cur}${expressions[i]}`;
      return (acc += next);
    }, "")
    .trim();
  const prevZippedStrings = useRef<string>(zippedStrings);
  const [classString, setClassString] = useState(() => {
    zippedStrings.split(";").forEach((declaration) => {
      const decl = declaration.trim();
      if (decl === "") return;
      if (classMap.has(decl)) {
        const refCount = refMap.get(decl)!;
        refMap.set(decl, refCount + 1);
      } else {
        const cssClass = `css-${getId()}`;
        const node = document.createTextNode(`.${cssClass} { ${declaration} }`);
        refMap.set(decl, 1);
        classMap.set(decl, cssClass);
        nodeMap.set(decl, node);
        element.appendChild(node);
      }
      classRef.current.add(classMap.get(decl)!);
    });

    return Array.from(classRef.current).join(" ");
  });

  useLayoutEffect(() => {
    if (zippedStrings !== prevZippedStrings.current) {
      // add declarations
      new Set(
        zippedStrings
          .split(";")
          .filter((x) => !prevZippedStrings.current.split(";").includes(x))
      ).forEach((declaration) => {
        const decl = declaration.trim();
        if (decl === "") return;
        const refCount = refMap.get(decl) ?? 0;
        if (refCount >= 1) {
          refMap.set(decl, refCount + 1);
        } else {
          refMap.set(decl, 1);
          const cssClass = `css-${getId()}`;
          const node = document.createTextNode(`.${cssClass} { ${decl} }`);
          nodeMap.set(decl, node);
          classMap.set(decl, cssClass);
          element.appendChild(node);
          classRef.current.add(cssClass);
        }
      });

      // remove declarations
      new Set(
        prevZippedStrings.current
          .split(";")
          .filter((x) => !zippedStrings.split(";").includes(x))
      ).forEach((declaration) => {
        const decl = declaration.trim();

        if (decl === "") return;

        const refCount = refMap.get(decl)!;
        if (refCount > 1) {
          refMap.set(decl, refCount - 1);
        } else {
          refMap.delete(decl);
          classRef.current.delete(classMap.get(decl)!);
          classMap.delete(decl);
          const node = nodeMap.get(decl)!;
          nodeMap.delete(decl);
          element.removeChild(node);
        }
      });
      prevZippedStrings.current = zippedStrings;
      setClassString(Array.from(classRef.current).join(" "));
    }
  }, [zippedStrings]);

  return classString;
}
