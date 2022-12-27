let { expect } = require('chai')
import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Home from '../pages/index.js';
import mockRouter from 'next-router-mock';
jest.mock('next/router', () => require('next-router-mock'));

beforeEach(() => {
  mockRouter.setCurrentUrl("/");
  render(<Home />);
});
describe("Should Search Fields initialsed", () => {
  it("Should Render Header", () => {
    expect(screen.getByText("Logger Application")).to.exist;
  });

  it("Should Render Log ID Field", () => {
    let subTitle = screen.getAllByText(/Log Id/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render Application ID Field", () => {
    let subTitle = screen.getAllByText(/Application Id/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render Application Type Field", () => {
    let subTitle = screen.getAllByText(/Application Type/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render Action Type Field", () => {
    let subTitle = screen.getAllByText(/Application Type/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render From Datepicker Field", () => {
    let subTitle = screen.getAllByText(/From/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render To Datepicker Field", () => {
    let subTitle = screen.getAllByText(/To/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render Search Button", () => {
    let subTitle = screen.getAllByText(/search/i);
    expect(subTitle[0]).to.exist;
  });

  it("Should Render Clear All", () => {
    let subTitle = screen.getAllByText(/clear all/i);
    expect(subTitle[0]).to.exist;
  });
});

describe("Check Events", () => {
  it("Should Search button clicked", () => {
    const searchBTN = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchBTN);
  });

  it("Should Clear button clicked", () => {
    const clearBTN = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearBTN);
  });
});
